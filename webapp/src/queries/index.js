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

export const GET_BUDGETS = gql`
  query getBudgetsForUser($_id: String!) {
    getBudgetsForUser(_id: $_id) {
      _id
      month
    }
  }
`

export const ADD_BUDGET = gql`
  mutation($creator: String, $month: String) {
    addBudget(creator: $creator, month: $month) {
      _id
      creator
      month
    }
  }
`

export const DELETE_BUDGET = gql`
  mutation($creator: String, $_id: String) {
    deleteBudget(creator: $creator, _id: $_id) {
      status
    }
  }
`
