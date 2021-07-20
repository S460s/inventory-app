const objPromiseAll = require('obj-promise-all');
const { body, validationResult } = require('express-validator');

const Category = require('../models/categoryModel');
const Item = require('../models/itemModel');

const inputValidationArr = [
	body('pswd', 'Password is required').trim().escape(),
	body('name', 'Category name required').trim().escape(),
	body('description', 'Description is required ').trim().escape(),
];

const category_list = (req, res, next) => {
	const categories = Category.find()
		.then((category_list) => {
			res.render('categories/category_list.pug', { category_list });
		})
		.catch(next);
};

const category_items = (req, res, next) => {
	const id = req.params.id;
	const category = Category.findById(id);
	const items = Item.find({ category: id });

	objPromiseAll({ category, items })
		.then(({ category, items }) => {
			res.render('categories/category_items.pug', {
				category,
				item_list: items,
			});
		})
		.catch(next);
};

const category_create_get = (req, res, next) => {
	res.render('categories/category_form.pug');
};

const category_create_post = [
	...inputValidationArr,

	(req, res, next) => {
		const errors = validationResult(req);
		const newCategory = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render('categories/category_form.pug', { errors: errors.array() });
		}

		const exsists = Category.exists({ name: req.body.name })
			.then((isThere) => {
				if (isThere) {
					res.render('categories/category_form.pug', {
						category: newCategory,
						errors: [{ msg: `Category ${req.body.name} already exsists.` }],
					});
				} else {
					newCategory
						.save()
						.then(() => {
							res.redirect('/category/list');
						})
						.catch(next);
				}
			})
			.catch(next);
	},
];

const category_update_get = (req, res, next) => {
	const isUpdate = true;
	Category.findById(req.params.id).then((category) => {
		res.render('categories/category_form.pug', { isUpdate, category });
	});
};

const category_update_post = [
	...inputValidationArr,
	(req, res, next) => {
		const id = req.params.id;
		const category = new Category({ ...req.body, _id: id });

		if (req.body.pswd === process.env.ADMIN_PSWD) {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.render('category/category_form.pug', {
					isUpdate,
					category,
					errors: errors.array(),
				});
				return;
			}
			const currentCategory = Category.findById(id, 'name');
			const isThere = Category.exists({ name: req.body.name });

			objPromiseAll({ currentCategory, isThere }).then(
				({ currentCategory, isThere }) => {
					console.log(currentCategory, isThere);
					if (isThere) {
						if (req.body.name !== currentCategory.name) {
							res.render('categories/category_form.pug', {
								category,
								errors: [{ msg: `Category ${req.body.name} already exsists.` }],
								isUpdate: true,
							});
							return;
						}
					}
					Category.findByIdAndUpdate(id, category, {})
						.then((result) => {
							res.redirect('/category/list');
						})
						.catch(next);
				}
			);
		} else {
			res.render('categories/category_form.pug', {
				category,
				errors: [{ msg: `Wrong password` }],
				isUpdate: true,
			});
		}
	},
];

const category_delete_get = (req, res, next) => {
	const id = req.params.id;
	Category.findById(id)
		.then((category) => {
			res.render('categories/category_delete.pug', { category });
		})
		.catch(next);
};

const category_delete_post = [
	body('pswd', 'Password is required').trim().escape(),
	(req, res, next) => {
		const id = req.params.id;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('categories/category_delete.pug', { errors: errors.array() });
			return;
		}
		if (req.body.pswd === process.env.ADMIN_PSWD) {
			Item.find({ category: id })
				.populate('category')
				.then((result) => {
					if (result.length > 0) {
						res.render('categories/category_delete.pug', {
							errors: [
								{ msg: 'You have to delete the following items first.' },
							],
							items: result,
							category: result[0].category,
						});
					} else {
						Category.findByIdAndDelete(id).then((result) => {
							res.redirect('/category/list');
						});
					}
				});
		} else {
			Category.findById(id)
				.then((category) => {
					console.log(category);
					res.render('categories/category_delete.pug', {
						errors: [{ msg: 'Wrong password' }],
						category,
					});
				})
				.catch(next);
		}
	},
];

module.exports = {
	category_list,
	category_items,
	category_create_get,
	category_create_post,
	category_update_get,
	category_update_post,
	category_delete_get,
	category_delete_post,
};
