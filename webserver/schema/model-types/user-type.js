/* eslint-disable no-unused-vars */
const graphql = require('graphql');
const { GraphQLString, GraphQLObjectType } = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

module.exports = UserType;
