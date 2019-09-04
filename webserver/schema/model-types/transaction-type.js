const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql;

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    _id: { type: GraphQLString },
    budget_id: { type: GraphQLString },
    category_id: { type: GraphQLString },
    description: { type: GraphQLString },
    debit: { type: GraphQLBoolean },
    credit: { type: GraphQLBoolean },
    amount: { type: GraphQLFloat },
    category_balance: { type: GraphQLFloat },
    created_at: { type: GraphQLString }
  })
});

module.exports = TransactionType;
