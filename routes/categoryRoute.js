const express = require('express');
const {
	category_list,
	category_items,
} = require('../controllers/categoryController');
const router = express.Router();

router.get('/list', category_list);
router.get('/:id', category_items);

module.exports = router;
