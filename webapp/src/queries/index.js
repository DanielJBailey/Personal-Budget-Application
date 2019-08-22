import { gql } from 'apollo-boost'
// RECIPES QUERIES

export const SIGNIN_USER = gql`
  mutation($username: String, $password: String, $token: String) {
    signInUser(username: $username, password: $password, token: $token) {
      token
      id
      username
    }
  }
`
export const GET_USER = gql`
  query getUser($token: String!) {
    getUser(token: $token) {
      _id
      username
    }
  }
`
