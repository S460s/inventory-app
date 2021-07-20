const express = require('express');
const {
	item_details,
	item_create_get,
	item_create_post,
	item_update_get,
	item_update_post,
	item_delete_get,
} = require('../controllers/itemController');

const router = express.Router();

router.get('/:catid/create', item_create_get);
router.post('/:catid/create', item_create_post);
router.get('/:id/update', item_update_get);
router.post('/:id/update', item_update_post);
router.get('/:id/delete', item_delete_get);

router.get('/:id', item_details);

module.exports = router;
