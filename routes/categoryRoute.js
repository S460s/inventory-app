const express = require('express');
const {
	category_list,
	category_items,
	category_create_post,
	category_create_get,
	category_update_get,
} = require('../controllers/categoryController');
const router = express.Router();

router.get('/list', category_list);
router.post('/create', category_create_post);
router.get('/create', category_create_get);
router.get('/:id/update', category_update_get);
router.get('/:id', category_items);

module.exports = router;
