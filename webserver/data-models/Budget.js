const { model, Schema, SchemaTypes } = require('mongoose');
const { CategoryModel } = require('./Category');
const { TransactionModel } = require('./Transaction');

const BudgetSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true, unique: true }
});

BudgetSchema.pre('findOneAndDelete', function(next) {
  CategoryModel.deleteMany({ budget_id: this._conditions._id }).exec();
  TransactionModel.deleteMany({ budget_id: this._conditions._id }).exec();
  next();
});

const BudgetModel = model('Budget', BudgetSchema, 'budgets');

module.exports = {
  BudgetModel,
  BudgetSchema,
  default: BudgetSchema
};
