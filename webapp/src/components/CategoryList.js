import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { GET_CATEGORIES } from '../queries/index'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { useBudget } from '../context/budget'
import propTypes from 'prop-types'
import IndividualCategory from './IndividualCategory'

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

  const renderCategory = (category, key) => (
    <Link className='link' key={key} to={`/category/${category._id}`}>
      <IndividualCategory category={category} />
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

export default CategoryList

CategoryList.propTypes = {
  categories: propTypes.array,
  setCategories: propTypes.func
}
