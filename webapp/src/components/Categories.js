import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import propTypes from 'prop-types'
import { GET_CATEGORIES } from '../queries/index'
import styled from '@emotion/styled'
import { useAuth } from '../context/auth'

const Categories = ({ budget, userCategories, setUserCategories }) => {
  const [currentBudget, setCurrentBudget] = useState({})
  const [getCategories, { loading, data }] = useLazyQuery(GET_CATEGORIES)
  const [incomeCategory, setIncomeCategory] = useState({})
  const [savingsCategory, setSavingsCategory] = useState({})
  const [emergencyCategory, setEmergencyCategory] = useState({})
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
      getCategories({ variables: { user_id: user._id, budget_id: budget._id } })
      setCurrentBudget(budget)
    }
  }, [budget])

  useEffect(() => {
    if (data && data.getCategories) {
      let userCategories = []
      setIncomeCategory(data.getCategories.find(c => c.name === 'Income'))
      setSavingsCategory(data.getCategories.find(c => c.name === 'Savings'))
      setEmergencyCategory(data.getCategories.find(c => c.name === 'Emergency Funds'))
      data.getCategories.forEach(c => {
        if (c.user_created) {
          userCategories.push(c)
        }
      })
      setUserCategories(userCategories)
    }
    setInitialLoad(false)
  }, [data])

  const renderCurrency = number => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(number)
  }

  const renderCategory = (category, key) => (
    <Category key={key}>
      <TitleSection>
        <CategoryTitle>{category.name}</CategoryTitle>
        <CategoryDescription>{category.description && category.description}</CategoryDescription>
      </TitleSection>
      <BalanceSection>
        <p>
          {category.name === 'Income' ? 'Income per month' : category.user_created ? 'Amount Remaining' : 'Balance'}
        </p>
        <CategoryBalance>
          {category.user_created ? renderCurrency(category.starting_balance) : renderCurrency(category.current_balance)}
        </CategoryBalance>
      </BalanceSection>
      <ClickToView>Click to add, edit, and view transactions</ClickToView>
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
          {userCategories.length > 0 && userCategories.map((c, i) => renderCategory(c, i))}
        </>
      )}
    </>
  )
}

const BalanceSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  font-size: 14px;

  p {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid #dcdcdc;
    padding: 3px 8px;
  }
`

const ClickToView = styled.p`
  font-size: 12px;
  font-style: italic;
  color: #ccc;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 1em;
`

const CategoryDescription = styled.p`
  margin-bottom: 0;
  font-size: 12px;
  color: #666;
`

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const CategoryBalance = styled.h4`
  font-size: 32px;
  font-weight: 500;
  color: rgba(31, 209, 161, 1);
`

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
  position: relative;
  cursor: pointer;
  transition: 0.2s linear;
  &:not(:first-of-type) {
    margin-top: 24px;
  }
  &:hover {
    box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.15);
  }
`

const CategoryTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
`

Categories.propTypes = {
  budget: propTypes.object,
  userCategories: propTypes.array,
  setUserCategories: propTypes.func
}

export default Categories
