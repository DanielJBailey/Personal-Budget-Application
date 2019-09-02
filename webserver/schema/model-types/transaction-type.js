const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql;

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    _id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    category_id: { type: GraphQLString },
    description: { type: GraphQLString },
    debit: { type: GraphQLBoolean },
    credit: { type: GraphQLBoolean },
    amount: { type: GraphQLFloat },
    date: { type: GraphQLString }
  })
});

module.exports = TransactionType;
