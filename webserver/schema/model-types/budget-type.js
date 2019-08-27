const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString } = graphql;

const BudgetType = new GraphQLObjectType({
  name: 'Budget',
  fields: () => ({
    _id: { type: GraphQLString },
    creator: { type: GraphQLString },
    month: { type: GraphQLString },
    status: { type: GraphQLString }
  })
});

module.exports = BudgetType;
