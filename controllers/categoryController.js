const objPromiseAll = require('obj-promise-all');
const { body, validationResult } = require('express-validator');

const Category = require('../models/categoryModel');
const Item = require('../models/itemModel');

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
	body('name', 'Category name required').trim().escape(),
	body('description', 'Description is required ').trim().escape(),

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

module.exports = {
	category_list,
	category_items,
	category_create_get,
	category_create_post,
};
