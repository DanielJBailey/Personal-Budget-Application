const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    _id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    budget_id: { type: GraphQLString },
    name: { type: GraphQLString },
    starting_balance: { type: GraphQLInt },
    current_balance: { type: GraphQLInt },
    description: { type: GraphQLString }
  })
});

module.exports = CategoryType;
