const graphql = require('graphql');
const jwt = require('jsonwebtoken');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql;
const { TransactionModel } = require('../data-models/Transaction');
const TransactionType = require('./model-types/user-type');
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
        password: { type: GraphQLString }
      },
      resolve: async (parent, { username, password }) => {
        const user = await UserModel.findOne({ username });
        if (user) {
          throw new Error('Username already exists.');
        } else {
          const newUser = await new UserModel({ username, password }).save();
          return { token: createToken({ userId: newUser.id, username: newUser.username }, process.env.SECRET, '1hr') };
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
      resolve: async (parents, { username, password, token }) => {
        // if request has token already, verify and return logged in user if valid
        if (token) {
          const authorized = await jwt.verify(token, process.env.SECRET);
          if (authorized) {
            const user = await UserModel.findOne({ username: authorized.username });
            return { id: user._id, username: user.username };
          } else throw new Error('Unauthorized.');
        } else {
          // else just sign in user
          const user = await UserModel.findOne({ username });
          if (!user) {
            throw new Error('There is currently no account associated with that username.');
          } else {
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
              throw new Error('Password is incorrect!');
            } else {
              const token = createToken({ userId: user.id, username: user.username }, process.env.SECRET, '1hr');
              return { token, id: user._id, username: user.username };
            }
          }
        }
      }
    }
  }
});

module.exports = mutation;
