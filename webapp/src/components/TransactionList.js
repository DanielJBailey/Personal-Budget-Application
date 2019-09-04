import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import propTypes from 'prop-types'

const TransactionList = ({ transactions }) => {
  const [sortedTransactions, setSortedTransactions] = useState([])

  useEffect(() => {
    console.log(transactions)
    if (transactions.length > 0) {
      let sorted = transactions.sort((a, b) => b.created_at - a.created_at)
      setSortedTransactions(sorted)
    }
  }, [transactions])

  const renderCurrency = number => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(number)
  }

  return (
    <Table>
      <Head>
        <HeaderRow>
          <HeaderCell center>Type</HeaderCell>
          <HeaderCell>Description</HeaderCell>
          <HeaderCell>Transaction Amount</HeaderCell>
          <HeaderCell>Account Balance</HeaderCell>
        </HeaderRow>
      </Head>
      <Body>
        {sortedTransactions &&
          sortedTransactions.map((transaction, i) => {
            return (
              <Row key={i}>
                <Cell center positive={transaction.credit}>
                  <i className={transaction.debit ? `fas fa-minus` : 'fas fa-plus'} />
                </Cell>
                <Cell>{transaction.description}</Cell>
                <Cell>{renderCurrency(transaction.amount)}</Cell>
                <Cell negative={parseFloat(transaction.category_balance) < 0}>
                  {renderCurrency(transaction.category_balance)}
                </Cell>
              </Row>
            )
          })}
      </Body>
    </Table>
  )
}

const Table = styled.table`
  width: 100%;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border-collapse: collapse;
  background-color: white;
`

const Body = styled.tbody``
const Cell = styled.td`
  padding: 16px;
  font-size: 14px;
  border: none;
  text-align: ${props => {
    if (props.center) return 'center'
    else return 'inherit'
  }};
  color: ${props => {
    if (props.negative) return 'red'
    if (props.positive === true) return 'rgba(31, 209, 161, 1)'
    else if (props.positive === false) return '#ee5253'
    else return '333'
  }};
`

const Head = styled.thead``
const HeaderRow = styled.tr``
const Row = styled.tr`
  &:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const HeaderCell = styled.th`
  font-size: 12px;
  font-weight: normal;
  padding: 16px;
  text-align: ${props => {
    if (props.center) return 'center'
    else return 'left'
  }};
`

export default TransactionList

TransactionList.propTypes = {
  transactions: propTypes.array
}
