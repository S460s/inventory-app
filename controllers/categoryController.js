const objPromiseAll = require('obj-promise-all');

const Category = require('../models/categoryModel');
const Item = require('../models/itemModel');

const category_list = (req, res, next) => {
	const categories = Category.find().then((category_list) => {
		res.render('categories/category_list.pug', { category_list });
	});
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

module.exports = {
	category_list,
	category_items,
	category_create_get,
};
