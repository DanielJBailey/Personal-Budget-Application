const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLBoolean } = graphql;

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    _id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    budget_id: { type: GraphQLString },
    name: { type: GraphQLString },
    starting_balance: { type: GraphQLFloat },
    current_balance: { type: GraphQLFloat },
    description: { type: GraphQLString },
    user_created: { type: GraphQLBoolean },
    status: { type: GraphQLString }
  })
});

module.exports = CategoryType;
