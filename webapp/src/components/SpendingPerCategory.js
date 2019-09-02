import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import BarChart from './BarChart'

const SpendingPerCategory = ({ categories }) => {
  const [sortedCategories, setSortedCategories] = useState([])

  useEffect(() => {
    if (categories.length > 0) {
      let sorted = categories.filter(c => c.user_created === true)
      sorted = sorted.map(f => {
        f = {
          ...f,
          spent: f.starting_balance - f.current_balance
        }
        return f
      })
      sorted = sorted.sort((a, b) => b.spent - a.spent)
      setSortedCategories(sorted)
    }
  }, [categories])

  const renderChart = (chart, key) => {
    return (
      <Category key={key}>
        <h5>{chart.name}</h5>
        {}
        <BarChart
          negative={chart.starting_balance - chart.current_balance < 0}
          remaining={chart.starting_balance - chart.current_balance}
          spending
          startingAmount={chart.starting_balance}
        />
      </Category>
    )
  }

  return (
    <Card>
      <h4>Spending Per Category</h4>
      {sortedCategories.map((chart, i) => (chart.user_created ? renderChart(chart, i) : null))}
    </Card>
  )
}

SpendingPerCategory.propTypes = {
  categories: propTypes.array
}

const Category = styled.div`
  padding: 8px 0;
  width: 100%;
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

  h5 {
    font-weight: normal;
    font-size: 14px;
  }
`

SpendingPerCategory.propTypes = {
  categories: propTypes.array
}

export default SpendingPerCategory
