import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useAuth } from '../context/auth'
import propTypes from 'prop-types'

const Home = ({ history }) => {
  const { user, setUser } = useAuth()

  const logOutUser = async () => {
    await window.localStorage.removeItem('budget-auth')
    setUser({})
    history.push('/login')
  }

  return (
    <>
      <Link to='/login'>Login</Link>Home Page {user.username}
      <button onClick={() => logOutUser()}>Logout</button>
    </>
  )
}

export default withRouter(Home)

Home.propTypes = {
  history: propTypes.object
}
