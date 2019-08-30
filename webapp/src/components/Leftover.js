import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import propTypes from 'prop-types'

const LeftOver = ({ incomeCategory, userCategories }) => {
  const [remaining, setRemaining] = useState(0)
  const [negative, setNegative] = useState(false)
  const [startingAmount, setStartingAmount] = useState(0)

  useEffect(() => {
    if (incomeCategory && userCategories) {
      let income = incomeCategory.current_balance || 0
      setStartingAmount(income)
      let expense = 0
      userCategories.forEach(c => {
        expense += c.starting_balance
      })
      let remainingBalance = income - expense
      setRemaining(remainingBalance)
    }
  }, [incomeCategory, userCategories])

  useEffect(() => {
    if (remaining < 0) {
      setNegative(true)
    } else setNegative(false)
  }, [remaining])

  const renderBarChart = () => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
      let percent = (remaining / startingAmount) * 100
      if (!isNaN(percent)) {
        setWidth(percent)
      }
    }, [remaining])

    return (
      <BarChartContainer>
        <BarChart remaining={remaining}>
          <Amount negative={negative}>{renderCurrency(remaining)}</Amount>
          <Bar width={width} />
        </BarChart>
        <Legend>
          <Amount legend>{renderCurrency(0)}</Amount>
          <Amount legend>{renderCurrency(startingAmount)}</Amount>
        </Legend>
      </BarChartContainer>
    )
  }

  const renderCurrency = number => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(number)
  }

  return (
    <Card>
      <h4>Amount Leftover</h4>
      {renderBarChart()}
    </Card>
  )
}

const Legend = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Amount = styled.div`
  font-size: 14px;
  z-index: 2;
  text-align: center;
  color: ${props => {
    if (props.legend) return 'rgba(0,0,0,0.4)'
    else return 'inherit'
  }};
`

const BarChart = styled.div`
  height: 35px;
  width: 100%;
  background-color: ${props => {
    if (props.remaining < 0) return '#ee5253'
    else return 'rgba(0, 0, 0, 0.05)'
  }};
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 35px;
  width: ${props => {
    return props.width + '%'
  }};
  transition: 0.75s linear;
  background-color: ${props => {
    if (props.width < 30) {
      return '#ee5253'
    } else if (props.width < 60) {
      return 'yellow'
    } else return '#1dd1a1'
  }};
`

const BarChartContainer = styled.div`
  width: 100%;
  margin-top: 8px;
`

const Card = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 1em;
  position: relative;
  margin-top: 24px;
`

export default LeftOver

LeftOver.propTypes = {
  userCategories: propTypes.array,
  incomeCategory: propTypes.object
}
