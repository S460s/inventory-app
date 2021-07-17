if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('myapp');

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		debug('Connected to DB.');
		app.listen(PORT, () => {
			debug(`Listening on PORT ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
