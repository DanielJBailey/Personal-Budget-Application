const graphql = require('graphql');
const TransactionType = require('./model-types/transaction-type');
const BudgetType = require('./model-types/budget-type');
const CategoryType = require('./model-types/category-type');
const Transactions = require('../query-resolvers/transaction-resolvers.js');
const UserType = require('./model-types/user-type');
const { UserModel } = require('../data-models/User');
const { BudgetModel } = require('../data-models/Budget');
const { CategoryModel } = require('../data-models/Category');

const jwt = require('jsonwebtoken');

const { GraphQLBoolean, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInputObjectType } = graphql;
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
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
        _id: { type: GraphQLString }
      },
      resolve: async (parent, { _id }) => {
        const budgets = await BudgetModel.find({ creator: _id });
        return budgets;
      }
    },
    transaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return Transactions.findOne(args.id);
      }
    },
    transactions: {
      type: GraphQLList(TransactionType),
      args: {
        amount: { type: GraphQLFloat },
        credit: { type: GraphQLBoolean },
        debit: { type: GraphQLBoolean },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        user_id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return Transactions.find(args);
      }
    }
  })
});

module.exports = RootQuery;
