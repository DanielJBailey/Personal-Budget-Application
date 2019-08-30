const graphql = require('graphql');
const jwt = require('jsonwebtoken');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql;
const { TransactionModel } = require('../data-models/Transaction');
const { CategoryModel } = require('../data-models/Category');
const CategoryType = require('./model-types/category-type');
const TransactionType = require('./model-types/user-type');
const { BudgetModel } = require('../data-models/Budget');
const BudgetType = require('./model-types/budget-type');
const UserType = require('./model-types/user-type');
const { UserModel } = require('../data-models/User');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username } = user;
  return jwt.sign({ username }, secret, { expiresIn });
};

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCategory: {
      type: CategoryType,
      args: {
        user_id: { type: GraphQLString },
        budget_id: { type: GraphQLString },
        name: { type: GraphQLString },
        starting_balance: { type: GraphQLFloat },
        current_balance: { type: GraphQLFloat },
        description: { type: GraphQLString }
      },
      resolve: async (parentValue, { user_id, budget_id, name, starting_balance, current_balance, description }) => {
        const category = await CategoryModel.findOne({ user_id, budget_id, name });
        if (category) {
          throw new Error('Category already exists for this budget!');
        } else {
          return new CategoryModel({
            user_id,
            description,
            budget_id,
            starting_balance,
            current_balance,
            name,
            user_created: true
          }).save();
        }
      }
    },
    deleteBudget: {
      type: BudgetType,
      args: {
        creator: { type: GraphQLString },
        _id: { type: GraphQLString }
      },
      resolve: async (parentValue, { creator, _id }) => {
        await BudgetModel.findOneAndDelete({ _id, creator });
        return { status: 'Budget was successfully deleted' };
      }
    },
    addBudget: {
      type: BudgetType,
      args: {
        creator: { type: GraphQLString },
        month: { type: GraphQLString }
      },
      resolve: async (parentValue, { creator, month }) => {
        const budget = await BudgetModel.findOne({ creator, month });
        if (budget) {
          throw new Error('Budget already exists for that month.');
        } else {
          const newBudget = await new BudgetModel({ month, creator }).save();
          await new CategoryModel({
            user_id: creator,
            budget_id: newBudget._id,
            name: 'Income',
            current_balance: 0.0,
            description: 'All sources of income for the month.',
            user_created: false
          }).save();
          await new CategoryModel({
            user_id: creator,
            budget_id: newBudget._id,
            name: 'Savings',
            current_balance: 0.0,
            description: 'Savings account balance.',
            user_created: false
          }).save();
          await new CategoryModel({
            user_id: creator,
            budget_id: newBudget._id,
            name: 'Emergency Funds',
            current_balance: 0.0,
            description: 'All savings used for emergencies.',
            user_created: false
          }).save();
          return {
            _id: newBudget._id,
            month: newBudget.month,
            creator: newBudget.creator
          };
        }
      }
    },
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve(parentValue, { user_id, description, merchant_id, debit, credit, amount }) {
        return new TransactionModel({ user_id, description, merchant_id, debit, credit, amount }).save();
      }
    },
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        _id: { type: GraphQLString }
      },
      resolve: async (parent, { username, password }) => {
        const user = await UserModel.findOne({ username });
        if (user) {
          throw new Error('Username already exists.');
        } else {
          const newUser = await new UserModel({ username, password }).save();
          return {
            token: createToken(newUser, process.env.SECRET, '12hr'),
            _id: newUser._id,
            username: newUser.username
          };
        }
      }
    },
    signInUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
      },
      resolve: async (parents, { username, password }) => {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error('There is currently no account associated with that username.');
        } else {
          const isEqual = await bcrypt.compare(password, user.password);
          if (!isEqual) {
            throw new Error('Password is incorrect!');
          } else {
            const token = createToken(user, process.env.SECRET, '12hr');
            return { token, _id: user._id, username: user.username };
          }
        }
      }
    }
  }
});

module.exports = mutation;
