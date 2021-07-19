const express = require('express');
const { item_details } = require('../controllers/itemController');

const router = express.Router();

router.get('/:id', item_details);

module.exports = router;
