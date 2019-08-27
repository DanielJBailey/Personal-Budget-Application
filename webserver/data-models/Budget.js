const { model, Schema, SchemaTypes } = require('mongoose');

const BudgetSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true, unique: true }
});

const BudgetModel = model('Budget', BudgetSchema, 'budgets');

module.exports = {
  BudgetModel,
  BudgetSchema,
  default: BudgetSchema
};
