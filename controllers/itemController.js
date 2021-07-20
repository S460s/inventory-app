const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');
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

module.exports = {
	item_details,
	item_create_get,
};
