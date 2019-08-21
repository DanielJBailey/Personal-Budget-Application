import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { SIGNIN_USER } from '../queries/index'

export const FetchUser = ({ dispatch, children }) => {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {
    const token = await window.localStorage.getItem('budget-auth')
    setToken(token)
    setLoading(false)
  }

  return (
    <>
      {!loading && (
        <>
          <Mutation mutation={SIGNIN_USER} variables={{ token: token }}>
            {({ data, loading, error }) => {
              if (loading) return <div>loading...</div>
              if (error) return <div>Error</div>
              console.log(data)
              return children
            }}
          </Mutation>
        </>
      )}
    </>
  )
}

FetchUser.propTypes = {
  dispatch: propTypes.func,
  children: propTypes.object
}

export default connect()(FetchUser)
