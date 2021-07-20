const express = require('express');
const {
	item_details,
	item_create_get,
	item_create_post,
} = require('../controllers/itemController');

const router = express.Router();

router.get('/:catid/create', item_create_get);
router.post('/:catid/create', item_create_post);
router.get('/:id', item_details);

module.exports = router;
