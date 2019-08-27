/* eslint-disable no-unused-vars */
const path = require('path');
const graphql = require('graphql');
const { GraphQLList, GraphQLString, GraphQLObjectType } = graphql;

const { BudgetModel: Budget } = require('../../data-models/Budget');
const BudgetType = require('./budget-type');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    token: { type: GraphQLString },
    budgets: {
      type: new GraphQLList(BudgetType),
      resolve(parentValue, args) {
        return Budget.find({ creator: args._id });
      }
    }
  })
});

module.exports = UserType;
