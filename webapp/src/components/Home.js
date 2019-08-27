import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
import propTypes from 'prop-types'
import { GET_BUDGETS } from '../queries/index'
import styled from '@emotion/styled'
import { useAuth } from '../context/auth'

const Home = ({ history }) => {
  const [getBudgets, { data }] = useLazyQuery(GET_BUDGETS)
  const [budgets, setBudgets] = useState([])
  const [currentBudget, setCurrentBudget] = useState({})
  const [options, setOptions] = useState([])
  const { user } = useAuth()
  const [addingBudget, setAddingBudget] = useState(false)

  useEffect(() => {
    if (user._id) {
      getBudgets({ variables: { _id: user._id } })
    }
  }, [user])

  useEffect(() => {
    if (data && data.getBudgetsForUser) {
      const budgets = data.getBudgetsForUser
      budgets.map(budget => {
        delete budget.__typename
      })
      budgets.sort((a, b) => new Date(b.month) - new Date(a.month))
      // setBudgets(budgets)
    }
  }, [data])

  useEffect(() => {
    if (budgets) setCurrentBudget(budgets[0])
  }, [budgets])

  useEffect(() => {
    let options = []
    if (budgets && budgets.length > 0) {
      budgets.forEach(budget => {
        let option = { value: budget._id, label: budget.month }
        options.push(option)
      })
      setOptions(options)
    }
  }, [budgets])

  const renderMonth = month => {
    if (month) {
      let displayMonth = month.split('-')[0]
      let displayYear = month.split('-')[1]
      return (
        <MonthDisplay>
          <Month>{displayMonth}</Month>
          <Year>{displayYear}</Year>
        </MonthDisplay>
      )
    }
  }

  return (
    <Container>
      {budgets.length > 0 && (
        <HeaderContainer>
          {currentBudget && renderMonth(currentBudget.month)}
          <ButtonContainer>
            <SelectMonth>
              {options.map((o, i) => (
                <option key={i} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectMonth>
            <NewBudget>
              <i className='fas fa-plus icon' />
              Create New Budget
            </NewBudget>
          </ButtonContainer>
        </HeaderContainer>
      )}
      {budgets.length === 0 && (
        <NoBudgetContainer>
          <NoBudgets>You currently have no budgets to show.</NoBudgets>
          <NewBudget>
            <i className='fas fa-plus icon' />
            Create New Budget
          </NewBudget>
        </NoBudgetContainer>
      )}
    </Container>
  )
}

const NoBudgetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3em;
  background-color: white;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
`

const NoBudgets = styled.p`
  margin-bottom: 16px;
`

const NewBudget = styled.button`
  width: 200px;
  padding: 0 8px;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;

  .icon {
    margin-right: 8px;
  }

  &:hover {
    background-color: #333;
    color: white;
  }
`

const MonthDisplay = styled.span`
  display: flex;
  align-items: center;
`

const Month = styled.h1`
  font-size: 48px;
  line-height: 1;
`
const Year = styled.h2`
  line-height: 1;
  font-size: 18px;
  background-color: rgba(31, 209, 161, 1);
  padding: 5px;
  border-radius: 5px;
  margin-left: 8px;
`

const SelectMonth = styled.select`
  width: 200px;
  height: 40px;
  background-color: white;
  font-size: 14px;
  margin-right: 16px;
  border: 1px solid #dcdcdc;
  border-radius: none;
  cursor: pointer;
`

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  min-height: calc(100vh - 100px);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2em 1em;
  max-width: 1140px;
  margin: 0 auto;
`

export default withRouter(Home)

Home.propTypes = {
  history: propTypes.object
}
