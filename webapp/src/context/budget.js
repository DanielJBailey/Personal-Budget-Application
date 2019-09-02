import React, { createContext, useContext, useState } from 'react'
import propTypes from 'prop-types'

const initialState = {
  budget: {}
}

const BudgetContext = createContext(initialState)

export function BudgetProvider ({ children }) {
  const [currentBudget, setCurrentBudget] = useState({})

  return <BudgetContext.Provider value={{ currentBudget, setCurrentBudget }}>{children}</BudgetContext.Provider>
}

BudgetProvider.propTypes = {
  children: propTypes.object
}

export const useBudget = () => useContext(BudgetContext)
