import React from 'react'
import styled from '@emotion/styled'
import propTypes from 'prop-types'

const IndividualCategory = ({ category }) => {
  const renderCurrency = number => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(number)
  }

  return (
    <Category>
      <TitleSection>
        <CategoryTitle>{category.name}</CategoryTitle>
        <CategoryDescription>{category.description && category.description}</CategoryDescription>
      </TitleSection>
      <BalanceSection>
        <p>
          {category.name === 'Income' ? 'Income per month' : category.user_created ? 'Amount Remaining' : 'Balance'}
        </p>
        <CategoryBalance>{renderCurrency(category.current_balance)}</CategoryBalance>
      </BalanceSection>
      <ClickToView>Click to add, edit, and view transactions</ClickToView>
    </Category>
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
    @media (max-width: 425px) {
      text-align: center;
    }
  }

  @media (max-width: 425px) {
    margin: 16px 0;
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
  @media (max-width: 425px) {
    position: static;
    margin: 0;
    width: 100%;
    text-align: right;
  }
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
  @media (max-width: 425px) {
    width: 100%;
  }
`

const CategoryBalance = styled.h4`
  font-size: 32px;
  font-weight: 500;
  color: ${props => props.theme.green};
  @media (max-width: 425px) {
    font-size: 28px;
  }
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
  cursor: pointer;
  transition: 0.2s linear;
  cursor: pointer;
  margin-bottom: 16px;
  position: relative;
  &:hover {
    box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.15);
  }
  @media (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 16px;
  }
`

const CategoryTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
`

IndividualCategory.propTypes = {
  category: propTypes.object
}

export default IndividualCategory
