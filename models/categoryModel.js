const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
	{
		createdAt: { type: String },
		updatedAt: { type: String },
		name: { type: String, required: true },
		description: { type: String, required: true },
	},
	{
		timestamps: {
			currentTime: () => {
				return DateTime.now().toLocaleString(DateTime.DATE_MED);
			},
		},
	}
);

CategorySchema.virtual('url').get(function () {
	return '/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
