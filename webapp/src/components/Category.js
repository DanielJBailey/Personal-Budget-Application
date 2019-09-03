import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import propTypes from 'prop-types'
import { BodyContainer, BudgetContainer as TransactionContainer, StatsContainer } from './Home'
import NewTransactionForm from './NewTransactionForm'
import { useLazyQuery } from '@apollo/react-hooks'
import { Mutation } from 'react-apollo'
import { GET_CATEGORY, DELETE_CATEGORY, GET_CATEGORIES, GET_TRANSACTIONS } from '../queries/index'
import alert from 'sweetalert2'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth'
import EditCategoryForm from './EditCategoryForm'
import TransactionList from './TransactionList'

const Category = ({
  match: {
    params: { category_id: categoryId }
  },
  history: { push }
}) => {
  const { user } = useAuth()
  const [getCategoryInformation, { data: categoryData }] = useLazyQuery(GET_CATEGORY)
  const [getTransactions, { data: transactions }] = useLazyQuery(GET_TRANSACTIONS)
  const [category, setCategory] = useState(undefined)
  const [currentTransactions, setCurrentTransactions] = useState([])
  const [isUserCategory, setIsUserCategory] = useState(false)
  const [editing, setEditing] = useState(false)
  // const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (user) {
      getCategoryInformation({ variables: { user_id: user._id, _id: categoryId } })
    }
  }, [])

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData.getCategory)
    }
  }, [categoryData])

  useEffect(() => {
    if (category && category.user_created) setIsUserCategory(true)
    else setIsUserCategory(false)
  }, [category])

  const renderCurrency = number => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(number)
  }

  useEffect(() => {
    if (category && category.description) {
      getTransactions({ variables: { category_id: category._id } })
    }
  }, [category])

  useEffect(() => {
    if (transactions && transactions.getTransactions) {
      setCurrentTransactions(transactions.getTransactions)
    }
  }, [transactions])

  const handleDeleteConfirm = async deleteCategory => {
    alert
      .fire({
        title: 'Are you sure?',
        text: `This will delete the category for ${category.name}, and cannot be reverted!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#333',
        cancelButtonColor: '#ee5253',
        confirmButtonText: 'Confirm'
      })
      .then(async result => {
        if (result.value) {
          deleteCategory().then(() => {
            alert.fire('Category Deleted', `You have successfully deleted ${category.name}`, 'success')
            push('/')
          })
        }
      })
  }

  const renderCategoryName = categoryName => {
    return categoryName.split(' ').map(w => w.split('')[0].toUpperCase() + w.slice(1, w.length))
  }

  return (
    <>
      {category && (
        <Container>
          <Link className='back-button' to='/'>
            <Back>
              <i className='far fa-arrow-alt-circle-left icon' />
              Back to dashboard
            </Back>
          </Link>
          {isUserCategory && (
            <>
              <Overlay editing={editing} onClick={() => setEditing(false)} />
              <EditCategoryForm category={category} editing={editing} setEditing={setEditing} />
            </>
          )}
          <HeaderContainer>
            <TitleContainer>
              <CategoryTitle>{renderCategoryName(category.name)}</CategoryTitle>
              <CategoryDescription>{category.description}</CategoryDescription>
            </TitleContainer>
            <ButtonContainer>
              {isUserCategory && (
                <EditButton onClick={() => setEditing(!editing)}>
                  <i className='fas fa-edit icon' />
                  Edit Category
                </EditButton>
              )}
              {isUserCategory && (
                <Mutation
                  mutation={DELETE_CATEGORY}
                  refetchQueries={() => {
                    return [
                      {
                        query: GET_CATEGORIES,
                        variables: { user_id: user._id, budget_id: category.budget_id }
                      }
                    ]
                  }}
                  variables={{ budget_id: category.budget_id, _id: category._id }}
                >
                  {deleteCategory => {
                    return (
                      <Trash onClick={() => handleDeleteConfirm(deleteCategory)}>
                        <i className='far fa-trash-alt icon' />
                        Trash Category
                      </Trash>
                    )
                  }}
                </Mutation>
              )}
            </ButtonContainer>
          </HeaderContainer>
          <HR />
          {isUserCategory && (
            <BalanceContainer>
              <StartingBalance current={category.current_balance}>
                Current Balance: <span className='amount'>{renderCurrency(category.current_balance)}</span>
              </StartingBalance>
            </BalanceContainer>
          )}
          <BodyContainer>
            <TransactionContainer>
              <TransactionList transactions={currentTransactions} />
            </TransactionContainer>
            <StatsContainer>
              <NewTransactionForm category={category} />
            </StatsContainer>
          </BodyContainer>
        </Container>
      )}
    </>
  )
}

const StartingBalance = styled.h3`
  font-size: 22px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  .amount {
    font-size: 28px;
    font-weight: bold;
    margin-left: 8px;
    color: ${props => {
    if (props.current < 0) return '#ee5253'
    else return 'rgba(31, 209, 161, 1)'
  }};
  }
`

const EditButton = styled.button`
  padding: 8px 16px;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #333;
    color: white;
  }

  .icon {
    margin-right: 8px;
    font-size: 16px;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
  display: ${props => (props.editing ? 'block' : 'none')};
  animation: ${fadeIn} 0.5s linear;
`

const HR = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #dcdcdc;
  margin: 12px 0;
`

const BalanceContainer = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.025);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CategoryDescription = styled.p`
  margin-bottom: 0;
  font-size: 12px;
  color: #666;
  max-width: 450px;
`

const Back = styled.button`
  padding: 8px 16px;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #333;
    color: white;
  }

  .icon {
    margin-right: 8px;
    font-size: 18px;
  }
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 24px;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`

const Container = styled.div`
  min-height: calc(100vh - 100px);
  height: 100%;
  width: 100%;
  padding: 2em 1em;
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const Trash = styled.button`
  padding: 8px 16px;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #ee5253;
  color: #ee5253;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 16px;

  .icon {
    margin-right: 8px;
  }

  &:hover {
    background-color: #ee5253;
    color: white;
  }
`

const CategoryTitle = styled.h1`
  font-size: 48px;
`

Category.propTypes = {
  match: propTypes.object,
  history: propTypes.object
}

export default Category
