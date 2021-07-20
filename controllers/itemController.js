const objPromiseAll = require('obj-promise-all');
const { body, validationResult } = require('express-validator');

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

const item_create_post = [
	body('pswd', 'Password is required.').trim().escape().isLength({ min: 1 }),
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

	,
	(req, res, next) => {},
];

module.exports = {
	item_details,
	item_create_get,
};
