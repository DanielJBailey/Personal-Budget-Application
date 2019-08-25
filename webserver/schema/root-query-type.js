const graphql = require('graphql');
const TransactionType = require('./model-types/transaction-type');
const Transactions = require('../query-resolvers/transaction-resolvers.js');
const UserType = require('./model-types/user-type');
const { UserModel } = require('../data-models/User');
const jwt = require('jsonwebtoken');

const { GraphQLBoolean, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } = graphql;
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
            return { id: undefined, username: undefined };
          }
        }
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
