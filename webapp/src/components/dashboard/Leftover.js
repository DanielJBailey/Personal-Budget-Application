import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import propTypes from 'prop-types'
import BarChart from '../reusable/BarChart'

const LeftOver = ({ categories }) => {
  const [remaining, setRemaining] = useState(0)
  const [negative, setNegative] = useState(false)
  const [startingAmount, setStartingAmount] = useState(0)

  useEffect(() => {
    if (categories.length > 0) {
      let income = categories.find(c => c.name === 'Income')
      setStartingAmount(income.current_balance)
      let expenses = 0
      categories.forEach(c => {
        if (c.name !== 'Income') {
          expenses += c.starting_balance
        }
      })
      let remainingBalance = income.current_balance - expenses
      setRemaining(remainingBalance)
    }
  }, [categories])

  useEffect(() => {
    if (remaining < 0) {
      setNegative(true)
    } else setNegative(false)
  }, [remaining])

  return (
    <>
      <Card>
        <h4>Amount Leftover To Budget</h4>
        {remaining === 0 ? (
          <EveryDollar>ALL BALANCED</EveryDollar>
        ) : (
          <BarChart negative={negative} remaining={remaining} startingAmount={startingAmount} />
        )}
      </Card>
    </>
  )
}

const EveryDollar = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0;
  color: ${props => props.theme.green};
  border: 2px solid ${props => props.theme.green};
  border-radius: 5px;
  padding: 16px;
  width: 100%;
  text-align: center;
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

LeftOver.propTypes = {
  categories: propTypes.array
}

export default LeftOver
