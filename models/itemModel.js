const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const ItemSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		password: { type: String, required: true },
		price: { type: Number, required: true },
		numberInStock: { type: Number, required: true },
		contact: { type: String },
	},
	{
		timestamps: {
			currentTime: () => {
				return DateTime.now().toLocaleString(DateTime.DATE_MED);
			},
		},
	}
);

ItemSchema.virtual('url').get(function () {
	return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
