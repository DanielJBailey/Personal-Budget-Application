// import React, { useState, useEffect } from 'react'
import React, { useState, useEffect } from 'react'
// import { withRouter } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
import propTypes from 'prop-types'
import { GET_CATEGORIES } from '../queries/index'
// import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'
import { useAuth } from '../context/auth'
// import { ScaleLoader } from 'react-spinners'
// import alert from 'sweetalert2'

const Categories = ({ budget }) => {
  const [currentBudget, setCurrentBudget] = useState({})
  const [getCategories, { loading, data }] = useLazyQuery(GET_CATEGORIES)
  const [incomeCategory, setIncomeCategory] = useState({})
  const [savingsCategory, setSavingsCategory] = useState({})
  const [emergencyCategory, setEmergencyCategory] = useState({})
  const [userCategories, setUserCategories] = useState([])
  const [initialLoad, setInitialLoad] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user._id && budget) {
      setCurrentBudget(budget)
      getCategories({ variables: { user_id: user._id, budget_id: budget._id } })
    }
  }, [user])

  useEffect(() => {
    if (budget !== currentBudget && !initialLoad) {
      console.log('something changed')
      getCategories({ variables: { user_id: user._id, budget_id: budget._id } })
      setCurrentBudget(budget)
    }
  }, [budget])

  useEffect(() => {
    if (data && data.getCategories) {
      setIncomeCategory(data.getCategories.find(c => c.name === 'Income'))
      setSavingsCategory(data.getCategories.find(c => c.name === 'Savings'))
      setEmergencyCategory(data.getCategories.find(c => c.name === 'Emergency Funds'))
      setUserCategories(data.getCategories.find(c => c.name !== 'Income' || 'Savings' || 'Emergency Funds'))
    }
    setInitialLoad(false)
  }, [data])

  const renderCategory = category => (
    <Category>
      <CategoryTitle>{category.name}</CategoryTitle>
    </Category>
  )

  return (
    <>
      {loading ? (
        [{}, {}, {}, {}, {}].map((a, i) => <SkeletonCategory key={i} />)
      ) : (
        <>
          {incomeCategory && renderCategory(incomeCategory)}
          {savingsCategory && renderCategory(savingsCategory)}
          {emergencyCategory && renderCategory(emergencyCategory)}
        </>
      )}
    </>
  )
}

const SkeletonCategory = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  padding: 2em;
  min-height: 100px;
  &:not(:first-of-type) {
    margin-top: 24px;
  }
`

const Category = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  padding: 2em;
  &:not(:first-of-type) {
    margin-top: 24px;
  }
`

const CategoryTitle = styled.h3`
  font-size: 22px;
  font-weight: normal;
`

Categories.propTypes = {
  budget: propTypes.object
}

export default Categories
