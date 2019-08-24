import React from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom'
import { useAuth } from '../context/auth'

const Login = history => {
  const { user } = useAuth()

  if (user && user._id !== null) {
    return <Redirect to='/' />
  }

  return (
    <>
      <Link to='/'>Home</Link>Login
    </>
  )
}

export default withRouter(Login)
