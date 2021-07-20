const objPromiseAll = require('obj-promise-all');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');

const inputValidationArr = [
	body('password', 'Password is required.')
		.trim()
		.escape()
		.isLength({ min: 1 }),
	body('name', 'Name is required.').trim().escape().isLength({ min: 1 }),
	body('description', 'Description is required.')
		.trim()
		.escape()
		.isLength({ min: 1 }),
	body('price', 'Price is required.').trim().escape(),
	body('numberInStock', 'Number-in-Stock is required.')
		.trim()
		.escape()
		.isLength({ min: 1 }),
	body('contact', 'Contact is required.').trim().escape().isLength({ min: 1 }),
	body('imgUrl', 'Image URL is required.').trim().isLength({ min: 1 }),
];

const item_details = (req, res, next) => {
	const id = req.params.id;
	Item.findById(id)
		.populate('category')
		.then((item) => {
			res.render('items/item_details', { item });
		})
		.catch(next);
};

const item_create_get = (req, res, next) => {
	const catid = req.params.catid;
	Category.findById(catid)
		.then((category) => {
			res.render('items/item_form.pug', { category });
		})
		.catch(next);
};

const item_create_post = [
	...inputValidationArr,
	(req, res, next) => {
		const catid = req.params.catid;
		bcrypt
			.hash(req.body.password, 10)
			.then((hashedPassword) => {
				const item = new Item({
					...req.body,
					password: hashedPassword,
					category: catid,
				});

				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					Category.findById(catid).then((category) => {
						res.render('items/item_form.pug', {
							category,
							item,
							errors: errors.array(),
						});
					});
				} else {
					console.log(item);
					item.save().then((result) => {
						res.redirect(`/category/${catid}`);
					});
				}
			})
			.catch(next);
	},
];

const item_update_get = (req, res, next) => {
	const id = req.params.id;
	const isUpdate = true;
	Item.findById(id)
		.populate('category')
		.then((item) => {
			res.render('items/item_form.pug', {
				category: item.category,
				item,
				isUpdate,
			});
		});
};

const item_update_post = [
	inputValidationArr,
	(req, res, next) => {
		const id = req.params.id;
		const isUpdate = true;
		const errors = validationResult(req);
		Item.findById(id)
			.populate('category')
			.then((item) => {
				if (!errors.isEmpty()) {
					res.render('items/item_form.pug', {
						category: item.category,
						item,
						errors: errors.array(),
						isUpdate,
					});
					return;
				}

				console.log(item.password);

				bcrypt
					.compare(req.body.password, item.password)
					.then((result) => {
						console.log(result);
						if (result || req.body.password === process.env.ADMIN_PSWD) {
							Item.exists({ name: req.body.name })
								.then((isThere) => {
									if (isThere) {
										if (req.body.name !== item.name) {
											res.render('items/item_form.pug', {
												category: item.category,
												item,
												errors: [
													{ msg: `Item ${req.body.name} already exists.` },
												],
												isUpdate,
											});
											return;
										}
									}
									const newItem = new Item({
										...req.body,
										category: item.category._id,
										password: item.password,
										_id: id,
									});
									Item.findByIdAndUpdate(item._id, newItem, {}).then(() => {
										res.redirect(`${item.category.url}`);
									});
								})
								.catch(next);
						} else {
							res.render('items/item_form.pug', {
								category: item.category,
								item,
								errors: [{ msg: 'Wrong password' }],
								isUpdate,
							});
						}
					})
					.catch(next);
			})
			.catch(next);
	},
];

const item_delete_get = (req, res, next) => {
	const id = req.params.id;
	Item.findById(id)
		.populate('category')
		.then((item) => {
			res.render('items/item_delete.pug', { item, category: item.category });
		});
};

const item_delete_post = (req, res, next) => {
	const id = req.params.id;
	Item.findById(id)
		.populate('category')
		.then((item) => {
			bcrypt
				.compare(req.body.password, item.password)
				.then((result) => {
					if (result || req.body.password === process.env.ADMIN_PSWD) {
						Item.findByIdAndDelete(id).then(() => {
							res.redirect(item.category.url);
						});
					} else {
						res.render('items/item_delete.pug', {
							item,
							category: item.category,
							errors: [{ msg: 'Wrong password.' }],
						});
					}
				})
				.catch(next);
		});
};

module.exports = {
	item_details,
	item_create_get,
	item_create_post,
	item_update_get,
	item_update_post,
	item_delete_get,
	item_delete_post,
};
