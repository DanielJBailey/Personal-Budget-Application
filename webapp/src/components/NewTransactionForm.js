import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { ADD_TRANSACTION, GET_CATEGORIES, GET_CATEGORY, GET_TRANSACTIONS } from '../queries/index'
import styled from '@emotion/styled'
import alert from 'sweetalert2'
import { useAuth } from '../context/auth'
import propTypes from 'prop-types'
import { useBudget } from '../context/budget'

const initialState = {
  amount: '',
  credit: false,
  debit: true,
  description: ''
}

const options = [{ label: 'Debit', value: 'debit' }, { label: 'Credit', value: 'credit' }]

const NewTransactionForm = ({ category, budget_id: budgetId }) => {
  const [formValues, setFormValues] = useState({ ...initialState })
  const [showErrors, setShowErrors] = useState(false)
  const { user } = useAuth()
  const { currentBudget } = useBudget()

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSelect = ({ target: { value } }) => {
    if (value === 'debit') {
      setFormValues({ ...formValues, credit: false, debit: true })
    } else setFormValues({ ...formValues, credit: true, debit: false })
  }

  const handleSubmit = (e, addTransaction) => {
    e.preventDefault()
    addTransaction().then(async ({ data, loading }) => {
      if (!loading && data && data.addTransaction) {
        alert.fire('Transaction Added!', `You have successfully added the transaction.`, 'success')
        setFormValues({ ...initialState })
      }
    })
  }

  const renderErrors = errors => {
    return errors.map((err, i) => <Error key={i}>{err.message}</Error>)
  }

  return (
    <Mutation
      mutation={ADD_TRANSACTION}
      refetchQueries={() => {
        return [
          {
            query: GET_CATEGORIES,
            variables: { user_id: user._id, budget_id: currentBudget._id }
          },
          {
            query: GET_CATEGORY,
            variables: { user_id: user._id, _id: category._id }
          },
          {
            query: GET_TRANSACTIONS,
            variables: { category_id: category._id }
          }
        ]
      }}
      variables={{
        ...formValues,
        category_id: category._id,
        amount: parseFloat(formValues.amount),
        budget_id: budgetId
      }}
    >
      {(addTransaction, { loading, error, data }) => {
        if (error) {
          setShowErrors(true)
        } else {
          setShowErrors(false)
        }
        return (
          <Form onSubmit={e => handleSubmit(e, addTransaction)}>
            {error && showErrors && renderErrors(error.graphQLErrors)}
            <h4>Add Transaction</h4>
            <label className='label' htmlFor='amount'>
              Amount ($)
            </label>
            <input
              id='amount'
              min={0}
              name='amount'
              onChange={handleChange}
              placeholder='Amount'
              required
              step={0.01}
              type='number'
              value={formValues.amount}
            />
            <label className='label' htmlFor='type'>
              Transaction Type
            </label>
            <Select id='type' onChange={handleSelect}>
              {options.map((o, i) => (
                <option key={i} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <label className='label' htmlFor='description'>
              Description
            </label>
            <input
              id='description'
              name='description'
              onChange={handleChange}
              placeholder='Description'
              required
              value={formValues.description}
            />
            <Submit type='submit'>Submit</Submit>
          </Form>
        )
      }}
    </Mutation>
  )
}

const Error = styled.div`
  background-color: #ffe0df;
  color: #ff0000;
  width: 100%;
  text-align: center;
  padding: 16px;
  border-radius: 5px;
  margin-bottom: 16px;
  font-size: 14px;
`

const Select = styled.select`
  width: 100%;
  height: 43px;
  font-size: 14px;
  background-color: white;
  border: 1px solid #dcdcdc;
  margin-bottom: 8px;
`

const Submit = styled.button`
  width: 100%;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  font-size: 14px;
  margin-top: 16px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #333;
    color: white;
  }
`

const Form = styled.form`
  width: 100%;
  background-color: white;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 1em;
  .label {
    font-size: 14px;
    color: #666;
    margin: 5px 0;
  }
  input {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    &:not(:last-of-type) {
      margin-bottom: 8px;
    }
  }

  h4 {
    margin-bottom: 16px;
    font-size: 18px;
    text-align: center;
  }
`

export default NewTransactionForm

NewTransactionForm.propTypes = {
  category: propTypes.object,
  budget_id: propTypes.string
}
