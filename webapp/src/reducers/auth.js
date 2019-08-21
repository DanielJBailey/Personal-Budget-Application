const LOGIN_USER = 'LOGIN_USER'
const LOGOUT_USER = 'GET_CONTACTS'

export const loginUser = (user = {}) => {
  return { type: LOGIN_USER, user }
}

export const logoutUser = () => {
  return { type: LOGOUT_USER }
}

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return action.user
    case LOGOUT_USER:
      return {}
    default:
      return state
  }
}
