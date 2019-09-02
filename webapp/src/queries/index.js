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

export const ADD_CATEGORY = gql`
  mutation(
    $user_id: String!
    $budget_id: String!
    $name: String!
    $description: String
    $starting_balance: Float!
    $current_balance: Float
  ) {
    addCategory(
      user_id: $user_id
      budget_id: $budget_id
      name: $name
      description: $description
      starting_balance: $starting_balance
      current_balance: $current_balance
    ) {
      name
      current_balance
      starting_balance
      description
      _id
      user_created
    }
  }
`

export const GET_CATEGORY = gql`
  query($user_id: String, $name: String) {
    getCategory(user_id: $user_id, name: $name) {
      budget_id
      name
      current_balance
      starting_balance
      description
      _id
      user_created
    }
  }
`
export const GET_CATEGORIES = gql`
  query($budget_id: String, $user_id: String) {
    getCategories(budget_id: $budget_id, user_id: $user_id) {
      name
      current_balance
      starting_balance
      description
      _id
      user_created
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation($budget_id: String, $_id: String) {
    deleteCategory(budget_id: $budget_id, _id: $_id) {
      status
    }
  }
`
