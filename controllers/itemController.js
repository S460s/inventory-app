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
	body('price', 'Price is required.').trim().escape().isLength({ min: 1 }),
	body('numberInStock', 'Number-in-Stock is required.')
		.trim()
		.escape()
		.isLength({ min: 1 }),
	body('contact', 'Contact is required.').trim().escape().isLength({ min: 1 }),
	body('imgUrl', 'Image URL is required.').trim().escape().isLength({ min: 1 }),
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
		Item.findById(id).then((item) => {
			bcrypt.compare(req.body.password, item.password).then((result) => {
				if (result || req.body.password === process.env.ADMIN_PSWD) {
					res.send('OK');
				} else {
					res.send('Not OK');
				}
			});
		});
	},
];

module.exports = {
	item_details,
	item_create_get,
	item_create_post,
	item_update_get,
	item_update_post,
};
