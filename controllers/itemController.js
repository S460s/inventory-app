const Item = require('../models/itemModel');

const item_details = (req, res, next) => {
	const id = req.params.id;
	Item.findById(id)
		.populate('category')
		.then((item) => {
			res.render('items/item_details', { item });
		});
};

module.exports = {
	item_details,
};
