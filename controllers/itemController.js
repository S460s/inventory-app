const objPromiseAll = require('obj-promise-all');
const { body, validationResult } = require('express-validator');

const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');

const inputValidationArr = [
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
		const item = new Item({
			...req.body,
			category: catid,
		});

		const errors = validationResult(req);
		console.log(errors.array);
		if (!errors.isEmpty()) {
			Category.findById(catid).then((category) => {
				res.render('items/item_form.pug', {
					category,
					item,
					errors: errors.array(),
				});
			});
		} else {
			res.send('123123');
		}
	},
];

module.exports = {
	item_details,
	item_create_get,
	item_create_post,
};
