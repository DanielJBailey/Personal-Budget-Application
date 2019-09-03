import React from 'react'
import styled from '@emotion/styled'
import propTypes from 'prop-types'

const TransactionList = ({ transactions }) => {
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
          <HeaderCell>Date</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Description</HeaderCell>
          <HeaderCell>Amount</HeaderCell>
          <HeaderCell>Balance</HeaderCell>
        </HeaderRow>
      </Head>
      <Body>
        {transactions &&
          transactions.map((transaction, i) => {
            return (
              <Row key={i}>
                <Cell>{transaction.date}</Cell>
                <Cell positive={transaction.credit}>
                  <i className={transaction.debit ? `fas fa-minus` : 'fas fa-plus'} />
                </Cell>
                <Cell>{transaction.description}</Cell>
                <Cell>{renderCurrency(transaction.amount)}</Cell>
                <Cell>{renderCurrency(transaction.category_balance)}</Cell>
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
  color: ${props => {
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
  text-align: left;
`

export default TransactionList

TransactionList.propTypes = {
  transactions: propTypes.array
}
