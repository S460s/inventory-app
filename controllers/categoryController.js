const Category = require('../models/categoryModel');

const category_list = (req, res, next) => {
	const categories = Category.find().then((category_list) => {
		res.render('categories/category_list.pug', { category_list });
	});
};

module.exports = {
	category_list,
};
