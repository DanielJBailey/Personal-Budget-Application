import React, { useState } from 'react'
import styled from '@emotion/styled'

const initialState = {
  amount: '',
  credit: false,
  debit: true,
  decription: '',
  date: ''
}

const options = [{ label: 'Debit', value: 'debit' }, { label: 'Credit', value: 'credit' }]

const NewTransactionForm = () => {
  const [formValues, setFormValues] = useState({ ...initialState })

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSelect = ({ target: { name, value } }) => {
    if (value === 'debit') {
      setFormValues({ ...formValues, credit: false, debit: true })
    } else setFormValues({ ...formValues, credit: true, debit: false })
  }

  return (
    <Form>
      <h4>Add Transaction</h4>
      <input
        name='amount'
        onChange={handleChange}
        placeholder='Amount:'
        required
        type='number'
        value={formValues.amount}
      />
      <Select onChange={handleSelect}>
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      <input name='date' onChange={handleChange} required type='date' value={formValues.date} />
      <input name='description' onChange={handleChange} placeholder='Description:' value={formValues.description} />
      <Submit type='submit'>Submit</Submit>
    </Form>
  )
}

const Select = styled.select`
  width: 100%;
  height: 43px;
  font-size: 14px;
  margin-bottom: 12px;
  background-color: white;
  border: 1px solid #dcdcdc;
`

const Submit = styled.button`
  width: 100%;
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  font-size: 14px;
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
  input {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    margin-bottom: 12px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
  }

  h4 {
    margin-bottom: 16px;
    font-size: 18px;
    text-align: center;
  }
`

export default NewTransactionForm
