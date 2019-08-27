const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql;

const BudgetType = new GraphQLObjectType({
  name: 'Budget',
  fields: () => ({
    _id: { type: GraphQLString },
    creator: { type: GraphQLString },
    month: { type: GraphQLString }
    // categories: {
    //   type: new GraphQLList(Cat),
    //   resolve(parentValue, args) {
    //     return Budget.find({ creator: args._id }).populate('Budget');
    //   }
  })
});

module.exports = BudgetType;
