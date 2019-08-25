import { gql } from 'apollo-boost'
// RECIPES QUERIES

export const SIGNIN_USER = gql`
  mutation($username: String, $password: String, $token: String) {
    signInUser(username: $username, password: $password, token: $token) {
      token
      _id
      username
    }
  }
`

export const SIGNUP_USER = gql`
  mutation($username: String, $password: String) {
    addUser(username: $username, password: $password) {
      token
      _id
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
