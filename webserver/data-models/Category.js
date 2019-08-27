const { model, Schema, SchemaTypes } = require('mongoose');

const CategorySchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  budget_id: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
  name: { type: String, required: true },
  starting_balance: { type: Number },
  current_balance: { type: Number },
  description: { type: String }
});

const CategoryModel = model('Category', CategorySchema, 'categories');

module.exports = {
  CategoryModel,
  CategorySchema,
  default: CategorySchema
};
