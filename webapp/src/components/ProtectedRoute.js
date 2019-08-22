import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import propTypes from 'prop-types'

export const ProtectedRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

const mapStateToProps = state => {
  return { isAuthenticated: state.auth.id }
}

ProtectedRoute.propTypes = {
  mapStateToProps: propTypes.func,
  isAuthenticated: propTypes.object,
  // isAuthenticated: propTypes.object,
  component: propTypes.object,
  location: propTypes.object
}

export default connect(mapStateToProps)(ProtectedRoute)