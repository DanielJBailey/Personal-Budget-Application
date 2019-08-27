const { model, Schema, SchemaTypes } = require('mongoose');

const TransactionSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  category_id: { type: String, default: null },
  amount: { type: Number, default: null },
  credit: { type: Boolean, default: null },
  debit: { type: Boolean, default: null },
  description: { type: String, default: null }
});

const TransactionModel = model('transaction', TransactionSchema, 'transactions');

module.exports = {
  TransactionModel,
  TransactionSchema,
  default: TransactionSchema
};
