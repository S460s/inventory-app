if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const mongoose = require('mongoose');

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
	console.log('Added Category: ' + theCategory);
}

function createCategories() {
	return Promise.all([
		categoryCreate('Fruits', 'Natural Seets'),
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
	category
) {
	const item = new Item({
		name,
		description,
		password,
		price,
		numberInStock,
		contact,
		category,
	});

	const theItem = await item.save();
	console.log(theItem);
}

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(async () => {
		console.log('Connected');
		await createCategories();
		await itemCreate(
			'Apple',
			'Tasty',
			'test123',
			1,
			1000,
			'qwerty',
			categories[0]
		);
		mongoose.connection.close();
		console.log('Disconected');
	})
	.catch((err) => {
		console.log(err);
		mongoose.connection.close();
		console.log('Disconected');
	});
