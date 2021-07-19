if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const mongoose = require('mongoose');
const debug = require('debug')('populate');

const Category = require('./models/categoryModel');
const Item = require('./models/itemModel');

const categories = [];

async function categoryCreate(name, description) {
	const category = new Category({
		name,
		description,
	});

	const theCategory = await category.save();
	categories.push(theCategory);
	debug('Added Category: ' + theCategory);
}

function createCategories() {
	return Promise.all([
		categoryCreate('Fruits', 'Natural Sweets'),
		categoryCreate('Coffees', 'Tasty hot drinks.'),
	]);
}

async function itemCreate(
	name,
	description,
	password,
	price,
	numberInStock,
	contact,
	category,
	imgUrl
) {
	const item = new Item({
		name,
		description,
		password,
		price,
		numberInStock,
		contact,
		category,
		imgUrl,
	});

	const theItem = await item.save();
	debug(theItem);
}

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(async () => {
		debug('Connected');
		await createCategories();
		await itemCreate(
			'Apple',
			'Tasty',
			'test123',
			1,
			1000,
			'qwerty',
			categories[0],
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Irp72r8lffgzSqG-HiGKmxE0zz6QJyABJA&usqp=CAU'
		);
		mongoose.connection.close();
		debug('Disconected');
	})
	.catch((err) => {
		console.log(err);
		mongoose.connection.close();
		debug('Disconected');
	});
