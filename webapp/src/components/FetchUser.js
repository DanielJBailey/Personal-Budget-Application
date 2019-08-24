import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { useLazyQuery } from '@apollo/react-hooks'
import { GET_USER } from '../queries/index'
import { useAuth } from '../context/auth'

export const FetchUser = ({ children }) => {
  const [token, setToken] = useState('')
  const [tokenFetched, setTokenFetched] = useState(false)
  const [getUserData, { data }] = useLazyQuery(GET_USER)
  const [finished, setFinished] = useState(false)
  const [userSet, setUserSet] = useState(false)
  const { user, setUser } = useAuth()

  useEffect(() => {
    async function getToken () {
      let token = await window.localStorage.getItem('budget-auth')
      setToken(token)
      setTokenFetched(true)
    }
    getToken()
  }, [])

  useEffect(() => {
    if (tokenFetched) {
      if (token === '' || 'null') {
        setFinished(true)
        setUserSet(true)
        setUser({})
      }
    }
  }, [tokenFetched])

  useEffect(() => {
    console.log(token)
    async function fetchUserData (userToken) {
      await getUserData({ variables: { token: userToken } })
    }
    if ((token !== '' || 'null') && tokenFetched) {
      console.log('getting data')
      fetchUserData(token)
    }
  }, [tokenFetched])

  useEffect(() => {
    if ((data !== {} || undefined) && (token !== '' || 'null')) {
      setUser(data.getUser)
      setUserSet(true)
    }
  }, [data])

  useEffect(() => {
    if (userSet && user) {
      setFinished(true)
    }
  }, [userSet, user])

  return <>{finished ? children : null}</>
}

FetchUser.propTypes = {
  children: propTypes.object
}

export default FetchUser
