import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import propTypes from 'prop-types'
import { useAuth } from '../context/auth'

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth()
  return (
    <Route
      {...rest}
      render={props =>
        user && user._id !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        )
      }
    />
  )
}

export default ProtectedRoute

ProtectedRoute.propTypes = {
  component: propTypes.object
}
