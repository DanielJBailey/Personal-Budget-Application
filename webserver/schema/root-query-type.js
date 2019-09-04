const graphql = require('graphql');
const BudgetType = require('./model-types/budget-type');
const CategoryType = require('./model-types/category-type');
const TransactionType = require('./model-types/transaction-type');
const UserType = require('./model-types/user-type');
const { UserModel } = require('../data-models/User');
const { BudgetModel } = require('../data-models/Budget');
const { CategoryModel } = require('../data-models/Category');
const { TransactionModel } = require('../data-models/Transaction');

const jwt = require('jsonwebtoken');

const { GraphQLList, GraphQLObjectType, GraphQLString } = graphql;
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    getTransactions: {
      type: new GraphQLList(TransactionType),
      args: {
        category_id: { type: GraphQLString }
      },
      resolve: async (parentValue, { category_id }) => {
        return await TransactionModel.find({ category_id });
      }
    },
    getUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve: async (parentValue, { token }) => {
        if (token) {
          try {
            const authorized = await jwt.verify(token, process.env.SECRET);
            if (authorized) {
              const user = await UserModel.findOne({ username: authorized.username });
              return ({ id, username } = user);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    getCategory: {
      type: CategoryType,
      args: {
        _id: { type: GraphQLString },
        user_id: { type: GraphQLString }
      },
      resolve: async (parentValue, { user_id, _id }) => {
        return await CategoryModel.findOne({ user_id, _id });
      }
    },
    getCategories: {
      type: new GraphQLList(CategoryType),
      args: {
        budget_id: { type: GraphQLString },
        user_id: { type: GraphQLString }
      },
      resolve: async (parentValue, { budget_id, user_id }) => {
        const categories = await CategoryModel.find({
          budget_id,
          user_id
        });
        return categories;
      }
    },
    getBudgetsForUser: {
      type: new GraphQLList(BudgetType),
      args: {
        creator: { type: GraphQLString }
      },
      resolve: async (parent, { creator }) => {
        const budgets = await BudgetModel.find({ creator });
        return budgets;
      }
    }
  })
});

module.exports = RootQuery;
