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
			console.log(category);

			console.log(items);
			res.render('categories/category_items', { category, item_list: items });
		})
		.catch(next);
};

module.exports = {
	category_list,
	category_items,
};
