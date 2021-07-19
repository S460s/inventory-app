const express = require('express');

const router = express.Router();

router.get('/:id', (req, res, next) => {
	res.send('SUCCESS');
});

module.exports = router;
