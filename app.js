if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('morgan');
const debug = require('debug')('myapp');

const categoryRouter = require('./routes/categoryRoute');

const PORT = process.env.PORT || 8000;

const app = express();

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

app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(helmet());

app.use(express.static('public'));

app.use('/categories', categoryRouter);

app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});
