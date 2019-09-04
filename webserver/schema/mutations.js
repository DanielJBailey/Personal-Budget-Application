const graphql = require('graphql');
const jwt = require('jsonwebtoken');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql;
const { TransactionModel } = require('../data-models/Transaction');
const { CategoryModel } = require('../data-models/Category');
const CategoryType = require('./model-types/category-type');
const TransactionType = require('./model-types/transaction-type');
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
    deleteTransaction: {
      type: TransactionType,
      args: {
        _id: { type: GraphQLString },
        category_id: { type: GraphQLString }
      },
      resolve: async (parentValue, { _id, category_id }) => {
        const category = await CategoryModel.findOne({ _id: category_id });
        // Find current transaction
        const transaction = await TransactionModel.findOne({ _id });
        // Transactions created after current transaction
        const transactions = await TransactionModel.find({ created_at: { $gt: transaction.created_at } });
        // // if transaction is credit, recredit
        if (transaction.credit) {
          // remove amount from category
          category.current_balance -= transaction.amount;
          category.save();
          // update recent transactions with updated amount
          if (transactions.length > 0) {
            transactions.forEach(t => {
              t.category_balance -= transaction.amount;
              t.save();
            });
          }
        } else {
          category.current_balance += transaction.amount;
          category.save();
          if (transactions.length > 0) {
            transactions.forEach(t => {
              t.category_balance += transaction.amount;
              t.save();
            });
          }
        }
        return await TransactionModel.findOneAndDelete({ category_id, _id });
      }
    },
    addTransaction: {
      type: TransactionType,
      args: {
        budget_id: { type: GraphQLString },
        category_id: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        credit: { type: GraphQLBoolean },
        debit: { type: GraphQLBoolean },
        description: { type: GraphQLString },
        date: { type: GraphQLString }
      },
      resolve: async (parentValue, { budget_id, category_id, amount, credit, debit, description, date }) => {
        const category = await CategoryModel.findOne({ _id: category_id });
        let category_balance;
        if (credit) {
          category_balance = category.current_balance + amount;
          category.current_balance += amount;
          category.save();
          return new TransactionModel({
            budget_id,
            category_id,
            amount,
            credit,
            debit,
            description,
            category_balance,
            date
          }).save();
        } else {
          category_balance = category.current_balance - amount;
          category.current_balance -= amount;
          category.save();
          return new TransactionModel({
            budget_id,
            category_id,
            amount,
            credit,
            debit,
            description,
            category_balance,
            date
          }).save();
        }
      }
    },
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
          name = name
            .toLowerCase()
            .split(' ')
            .map(word => word[0].toUpperCase() + word.substring(1))
            .join(' ');
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
    deleteCategory: {
      type: CategoryType,
      args: {
        budget_id: { type: GraphQLString },
        _id: { type: GraphQLString }
      },
      resolve: async (parentValue, { budget_id, _id }) => {
        return await CategoryModel.findOneAndDelete({ budget_id, _id });
      }
    },
    updateCategory: {
      type: CategoryType,
      args: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        starting_balance: { type: GraphQLFloat },
        description: { type: GraphQLString }
      },
      resolve: async (parentValue, { _id, name, starting_balance, description }) => {
        if (name === 'Savings' || name === 'Income' || name === 'Emergency Funds') {
          throw new Error('Category already exists with that name.');
        } else {
          const category = await CategoryModel.findOne({ _id });
          let previousStartingBalance = category.starting_balance;
          let difference = category.starting_balance - category.current_balance;
          category.name = name;
          category.starting_balance = starting_balance;
          category.current_balance = starting_balance - difference;
          category.description = description;
          // update transactions for category to reflect new starting amount
          const transactions = await TransactionModel.find({ category_id: _id });
          let startingBalanceDifference = starting_balance - previousStartingBalance;
          transactions.forEach(transaction => {
            transaction.category_balance += startingBalanceDifference;
            transaction.save();
          });
          return category.save();
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
            description: 'Balances in all savings accounts.',
            user_created: false
          }).save();
          await new CategoryModel({
            user_id: creator,
            budget_id: newBudget._id,
            name: 'Emergency Funds',
            current_balance: 0.0,
            description: 'All savings used for emergency situations.',
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
