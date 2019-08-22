import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { Query } from 'react-apollo'
import { GET_USER } from '../queries/index'
import { loginUser, logoutUser } from '../reducers/auth'

export const FetchUser = ({ dispatch, children }) => {
  const [token, setToken] = useState(undefined)

  useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {
    const token = await window.localStorage.getItem('budget-auth')
    setToken(token)
  }

  const setUser = async data => {
    if (data) {
      const { username, _id: id } = data
      if (username && id) {
        dispatch(loginUser({ id, username }))
      } else {
        await window.localStorage.removeItem('budget-auth')
        dispatch(logoutUser())
      }
    }
  }

  return (
    <>
      {token && (
        <Query query={GET_USER} variables={{ token: token }}>
          {data => {
            setUser(data.data.getUser)
            return <>{children}</>
          }}
        </Query>
      )}
    </>
  )
}

FetchUser.propTypes = {
  dispatch: propTypes.func,
  children: propTypes.object
}

export default connect()(FetchUser)
