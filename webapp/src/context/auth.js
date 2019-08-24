import React, { createContext, useContext, useState } from 'react'
import propTypes from 'prop-types'

const initialState = {
  user: {}
}

const UserContext = createContext(initialState)

export function UserProvider ({ children }) {
  const [user, setUser] = useState({})

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

UserProvider.propTypes = {
  children: propTypes.object
}

export const useAuth = () => useContext(UserContext)
