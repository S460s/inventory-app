const category_list = (req, res, next) => {
	res.render('categories/category_list.pug');
};

module.exports = {
	category_list,
};
