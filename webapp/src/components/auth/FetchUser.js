import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { useLazyQuery } from '@apollo/react-hooks'
import { GET_USER } from '../../queries/index'
import { useAuth } from '../../context/auth'

export const FetchUser = ({ children }) => {
  const [token, setToken] = useState('')
  const [tokenFetched, setTokenFetched] = useState(false)
  const [getUserData, { data }] = useLazyQuery(GET_USER)
  const [finished, setFinished] = useState(false)
  const [userSet, setUserSet] = useState(false)
  const { user, setUser } = useAuth()

  useEffect(() => {
    async function getToken () {
      const hasToken = await window.localStorage.hasOwnProperty('budget-auth')
      if (!hasToken) {
        setFinished(true)
        setUserSet(true)
        setUser({})
      } else {
        const token = await window.localStorage.getItem('budget-auth')
        setToken(token)
        setTokenFetched(true)
      }
    }
    getToken()
  }, [])

  useEffect(() => {
    async function fetchUserData (userToken) {
      await getUserData({ variables: { token: userToken } })
    }
    fetchUserData(token)
  }, [tokenFetched])

  useEffect(() => {
    if (data && data.getUser === null) {
      window.localStorage.removeItem('budget-auth')
      window.localStorage.removeItem('current-budget')
      setFinished(true)
      setUserSet(true)
      setUser({})
    }
    if (data && data.getUser) {
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
