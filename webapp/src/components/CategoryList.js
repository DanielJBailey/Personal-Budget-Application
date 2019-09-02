import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { GET_CATEGORIES } from '../queries/index'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { useBudget } from '../context/budget'
import propTypes from 'prop-types'

const CategoryList = ({ categories, setCategories }) => {
  const [getCategories, { loading, data }] = useLazyQuery(GET_CATEGORIES)
  const { user } = useAuth()
  const { currentBudget } = useBudget()

  useEffect(() => {
    if (user._id && currentBudget._id) {
      getCategories({ variables: { user_id: user._id, budget_id: currentBudget._id } })
    }
  }, [user, currentBudget])

  useEffect(() => {
    if (!loading && data && data.getCategories) {
      setCategories(data.getCategories)
    }
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
    <Link className='link' key={key} to={`/category/${category.name}`}>
      <Category>
        <TitleSection>
          <CategoryTitle>{category.name}</CategoryTitle>
          <CategoryDescription>{category.description && category.description}</CategoryDescription>
        </TitleSection>
        <BalanceSection>
          <p>
            {category.name === 'Income' ? 'Income per month' : category.user_created ? 'Amount Remaining' : 'Balance'}
          </p>
          <CategoryBalance>
            {category.user_created
              ? renderCurrency(category.starting_balance)
              : renderCurrency(category.current_balance)}
          </CategoryBalance>
        </BalanceSection>
        <ClickToView>Click to add, edit, and view transactions</ClickToView>
      </Category>
    </Link>
  )

  return <CategoryContainer>{categories.map((c, i) => renderCategory(c, i))}</CategoryContainer>
}

const CategoryContainer = styled.div`
  display: block;
  .link {
    margin-top: 24px !important;
  }
`

const SlideIn = keyframes`
  from {
    marginTop: 30px;
  }
  to {
    marginTop: 0;
  }
`

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
  max-width: 450px;
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

const Category = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  padding: 2em;
  position: relative;
  cursor: pointer;
  transition: 0.2s linear;
  animation: ${SlideIn} 0.5s linear;
  cursor: pointer;
  margin-bottom: 16px;

  &:hover {
    box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.15);
  }
`

const CategoryTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
`

export default CategoryList

CategoryList.propTypes = {
  categories: propTypes.array,
  setCategories: propTypes.func
}
