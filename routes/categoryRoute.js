const express = require('express');
const { category_list } = require('../controllers/categoryController');
const router = express.Router();

router.get('/', category_list);

module.exports = router;
