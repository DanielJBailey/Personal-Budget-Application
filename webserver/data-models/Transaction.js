const { model, Schema, SchemaTypes } = require('mongoose');

const TransactionSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  category_id: { type: String, required: true },
  user_id: { type: String, required: true },
  amount: { type: Number, required: true },
  credit: { type: Boolean, required: true },
  debit: { type: Boolean, required: true },
  description: { type: String, default: null },
  date: { type: Date, default: null, required: true }
});

const TransactionModel = model('transaction', TransactionSchema, 'transactions');

module.exports = {
  TransactionModel,
  TransactionSchema,
  default: TransactionSchema
};
