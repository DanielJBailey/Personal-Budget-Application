/* eslint-disable no-unused-vars */
const path = require('path');
const graphql = require('graphql');
const {
  // GraphQLList,
  GraphQLString,
  GraphQLObjectType
} = graphql;

// const { TransactionModel: Transaction } = require(path.join('..', 'data-models', 'Transaction'))
// const TransactionType = require('./transaction-type')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    token: { type: GraphQLString }
    // transactions: {
    //   type: new GraphQLList(TransactionType),
    //   resolve (parentValue, args) {
    //     return Transaction.find({ user_id: args.id }).populate('transaction')
    //   }
    // }
  })
});

module.exports = UserType;
