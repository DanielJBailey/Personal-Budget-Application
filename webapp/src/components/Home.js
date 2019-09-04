import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
// import propTypes from 'prop-types'
import { GET_BUDGETS, DELETE_BUDGET } from '../queries/index'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'
import { useAuth } from '../context/auth'
import { ScaleLoader } from 'react-spinners'
import alert from 'sweetalert2'
import NewBudgetForm from './NewBudgetForm'
import CategoryList from './CategoryList'
import NewCategoryForm from './NewCategoryForm'
import LeftOver from './Leftover'
import SpendingPerCategory from './SpendingPerCategory'

const Home = () => {
  const [getBudgets, { loading, data }] = useLazyQuery(GET_BUDGETS)
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [options, setOptions] = useState([])
  const [addingBudget, setAddingBudget] = useState(false)
  const [currentBudget, setCurrentBudget] = useState({})
  const { user } = useAuth()

  useEffect(() => {
    if (user._id) {
      getBudgets({ variables: { creator: user._id } })
    }
  }, [user])

  useEffect(() => {
    if (data && data.getBudgetsForUser) {
      const budgets = data.getBudgetsForUser
      budgets.map(budget => {
        delete budget.__typename
      })
      budgets.sort((a, b) => new Date(b.month) - new Date(a.month))
      setBudgets(budgets)
    }
  }, [data])

  useEffect(() => {
    async function setBudgetStorage (budget) {
      let storedBudget = await JSON.parse(window.localStorage.getItem('current-budget'))
      if (storedBudget) {
        setCurrentBudget(storedBudget)
      } else {
        await window.localStorage.setItem('current-budget', JSON.stringify(budget))
        setCurrentBudget(budget)
      }
    }
    if (budgets.length > 0) {
      setBudgetStorage(budgets[0])
    }
  }, [budgets])

  useEffect(() => {
    let options = []
    if (budgets && budgets.length > 0) {
      budgets.forEach(budget => {
        let option = { value: budget._id, label: budget.month }
        options.push(option)
      })
      options.sort((a, b) => new Date(b.label) - new Date(a.label))
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

  const handleMonthChange = async e => {
    let current = await budgets.find(b => b._id === e.target.value)
    setCurrentBudget(current)
    await window.localStorage.setItem('current-budget', JSON.stringify(current))
  }

  const handleDeleteConfirm = deleteBudget => {
    alert
      .fire({
        title: 'Are you sure?',
        text: `This will delete the budget for ${currentBudget.month}, and cannot be reverted!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#333',
        cancelButtonColor: '#ee5253',
        confirmButtonText: 'Confirm'
      })
      .then(async result => {
        if (result.value) {
          deleteBudget()
          await window.localStorage.removeItem('current-budget')
          let filteredBudgets = budgets.filter(b => b._id !== currentBudget._id)
          setBudgets(filteredBudgets)
          alert.fire('Deleted!', 'Your budget has been deleted.', 'success')
        }
      })
  }

  return (
    <Container>
      {loading ? (
        <NoBudgetContainer>
          <p>Please wait while we load your information.</p>
          <ScaleLoader color='#333' />
        </NoBudgetContainer>
      ) : (
        <>
          {addingBudget && <NewBudgetForm budgets={budgets} closeForm={setAddingBudget} setBudgets={setBudgets} />}
          {budgets.length === 0 && (
            <NoBudgetContainer>
              <NoBudgets>You currently have no budgets to show.</NoBudgets>
              <NewBudget onClick={() => setAddingBudget(true)}>
                <i className='fas fa-plus icon' />
                Create New Budget
              </NewBudget>
            </NoBudgetContainer>
          )}
          {budgets.length > 0 && (
            <>
              <HeaderContainer>
                {currentBudget && renderMonth(currentBudget.month)}
                <ButtonContainer>
                  <SelectMonth onChange={handleMonthChange} value={currentBudget._id}>
                    {options.map((o, i) => (
                      <option key={i} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </SelectMonth>
                  <NewBudget onClick={() => setAddingBudget(true)}>
                    <i className='fas fa-plus icon' />
                    Create New Budget
                  </NewBudget>
                  {currentBudget && (
                    <Mutation
                      mutation={DELETE_BUDGET}
                      refetchQueries={() => {
                        return [
                          {
                            query: GET_BUDGETS,
                            variables: { creator: user._id }
                          }
                        ]
                      }}
                      variables={{ creator: user._id, _id: currentBudget._id }}
                    >
                      {deleteBudget => {
                        return (
                          <Trash onClick={() => handleDeleteConfirm(deleteBudget)}>
                            <i className='far fa-trash-alt icon' />
                            Trash Budget
                          </Trash>
                        )
                      }}
                    </Mutation>
                  )}
                </ButtonContainer>
              </HeaderContainer>
              <BodyContainer>
                <BudgetContainer>
                  <CategoryList categories={categories} currentBudget={currentBudget} setCategories={setCategories} />
                </BudgetContainer>
                <StatsContainer>
                  <NewCategoryForm
                    categories={categories}
                    currentBudget={currentBudget}
                    setCategories={setCategories}
                  />
                  {categories.length > 3 && (
                    <>
                      <LeftOver categories={categories} />
                      <SpendingPerCategory categories={categories} />
                    </>
                  )}
                </StatsContainer>
              </BodyContainer>
            </>
          )}
        </>
      )}
    </Container>
  )
}

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const BudgetContainer = styled.div`
  flex: 2;
  width: 100%;
  margin-right: 24px;
`

export const StatsContainer = styled.div`
  flex: 1;
  width: 100%;
`

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
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);

  p {
    margin-bottom: 8px;
  }
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
  margin-right: 16px;

  .icon {
    margin-right: 8px;
  }

  &:hover {
    background-color: #333;
    color: white;
  }
`

const Trash = styled.button`
  padding: 8px 16px;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid ${props => props.theme.red};
  color: ${props => props.theme.red};
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;

  .icon {
    margin-right: 8px;
  }

  &:hover {
    background-color: ${props => props.theme.red};
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
  background-color: ${props => props.theme.green};
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
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin-top: 24px;
  }
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
