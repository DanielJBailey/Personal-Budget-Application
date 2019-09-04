const { model, Schema, SchemaTypes } = require('mongoose');

const TransactionSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  budget_id: { type: String, required: true },
  category_id: { type: String, required: true },
  amount: { type: Number, required: true },
  credit: { type: Boolean, required: true },
  debit: { type: Boolean, required: true },
  description: { type: String, default: null },
  category_balance: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

const TransactionModel = model('Transaction', TransactionSchema, 'transactions');

module.exports = {
  TransactionModel,
  TransactionSchema,
  default: TransactionSchema
};
