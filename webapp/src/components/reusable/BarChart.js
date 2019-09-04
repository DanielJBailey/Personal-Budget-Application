import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

const BarChart = ({ remaining, startingAmount, negative, spending }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    let percent = (remaining / startingAmount) * 100
    if (!isNaN(percent)) {
      setWidth(percent)
    }
  }, [remaining])

  const renderCurrency = number => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(number)
  }

  return (
    <BarChartContainer>
      <Chart remaining={remaining} startingAmount={startingAmount}>
        <Amount negative={negative}>
          {renderCurrency(remaining)}
          {` `}
          {spending && startingAmount - remaining < 0 ? `(${renderCurrency(remaining - startingAmount)})` : null}
        </Amount>
        <Bar remaining={remaining} spending={spending} startingAmount={startingAmount} width={width} />
      </Chart>
      <Legend>
        <Amount legend>{renderCurrency(0)}</Amount>
        <Amount legend>{renderCurrency(startingAmount)}</Amount>
      </Legend>
    </BarChartContainer>
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

const Chart = styled.div`
  height: 35px;
  width: 100%;
  background-color: ${props => {
    if (props.remaining < 0) return props.theme.red
    else return 'rgba(0, 0, 0, 0.05)'
  }};
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`
const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 35px;
  border-radius: 5px;
  width: ${props => {
    return props.width + '%'
  }};
  max-width: 100%;
  transition: 0.75s linear;
  background-color: ${props => {
    if (props.spending) {
      if (props.width <= 100) {
        return props.theme.green
      } else return props.theme.red
    } else {
      if (props.width < 10) {
        return props.theme.red
      } else if (props.width < 30) {
        return props.theme.yellow
      } else return props.theme.green
    }
  }};
`

const BarChartContainer = styled.div`
  width: 100%;
  margin-top: 8px;
`

BarChart.propTypes = {
  remaining: propTypes.number,
  startingAmount: propTypes.number,
  negative: propTypes.bool,
  spending: propTypes.bool
}

export default BarChart
