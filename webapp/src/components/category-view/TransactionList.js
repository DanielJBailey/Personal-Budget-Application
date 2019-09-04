import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import propTypes from 'prop-types'
import { GET_TRANSACTIONS, DELETE_TRANSACTION, GET_CATEGORY } from '../../queries'
import { Mutation } from 'react-apollo'
import { useAuth } from '../../context/auth'
import alert from 'sweetalert2'
import { useLazyQuery } from '@apollo/react-hooks'

const TransactionList = ({ categoryId }) => {
  const [getTransactions, { data }] = useLazyQuery(GET_TRANSACTIONS)
  const [transactions, setTransactions] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (categoryId) getTransactions({ variables: { category_id: categoryId } })
  }, [categoryId])

  useEffect(() => {
    if (data && data.getTransactions) {
      setTransactions(data.getTransactions)
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

  const handleDeleteConfirm = async deleteTransaction => {
    alert
      .fire({
        title: 'Are you sure?',
        text: `This will delete the transaction, and cannot be reverted!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#333',
        cancelButtonColor: '#ee5253',
        confirmButtonText: 'Confirm'
      })
      .then(async result => {
        if (result.value) {
          deleteTransaction().then(() => {
            alert.fire('Transaction Deleted', `You have successfully deleted the transaction`, 'success')
          })
        }
      })
  }

  return (
    <Table>
      <Head>
        <HeaderRow>
          <HeaderCell center>Type</HeaderCell>
          <HeaderCell>Description</HeaderCell>
          <HeaderCell>Transaction Amount</HeaderCell>
          <HeaderCell>Account Balance</HeaderCell>
          <HeaderCell center>Actions</HeaderCell>
        </HeaderRow>
      </Head>
      <Body>
        {transactions &&
          transactions.map((transaction, i) => {
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
                <Cell>
                  <Mutation
                    mutation={DELETE_TRANSACTION}
                    refetchQueries={() => {
                      return [
                        {
                          query: GET_CATEGORY,
                          variables: { user_id: user._id, _id: categoryId }
                        },
                        {
                          query: GET_TRANSACTIONS,
                          variables: { category_id: categoryId }
                        }
                      ]
                    }}
                    variables={{ category_id: transaction.category_id, _id: transaction._id }}
                  >
                    {deleteTransaction => {
                      return <ActionButton onClick={() => handleDeleteConfirm(deleteTransaction)}>Remove</ActionButton>
                    }}
                  </Mutation>
                </Cell>
              </Row>
            )
          })}
      </Body>
    </Table>
  )
}

const ActionButton = styled.button`
  outline: none;
  border: 1px solid #333;
  padding: 5px;
  background-color: transparent;
  border-radius: 5px;
  font-size: 12px;
  width: 100%;
  cursor: pointer;
  &:hover {
    border-color: ${props => props.theme.red};
    background-color: ${props => props.theme.red};
    color: white;
  }
`

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
    if (props.negative) return props.theme.red
    if (props.positive === true) return props.theme.green
    else if (props.positive === false) return props.theme.red
    else return '#333'
  }};

  .edit {
    margin-right: 16px;
    cursor: pointer;
  }

  .trash {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
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
  categoryId: propTypes.string
}
