import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import { useAuth } from '../context/auth'
import { ADD_BUDGET, GET_BUDGETS } from '../queries/index'
import propTypes from 'prop-types'
import alert from 'sweetalert2'

const NewBudgetForm = ({ setBudgets, closeForm, budgets }) => {
  const [formValues, setFormValues] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12
    }
    let d = new Date()
    let month = Object.keys(months).find(key => months[key] === d.getMonth() + 1)
    let year = d.getFullYear().toString()
    setFormValues({ month, year })
  }, [])

  const renderYearOptions = () => {
    let years = []
    const maxYear = parseInt(formValues.year) + 10
    for (let i = parseInt(formValues.year); i < maxYear; i++) {
      years.push(i)
    }
    return years.map((year, i) => (
      <option key={i} value={`${year}`}>
        {year}
      </option>
    ))
  }

  const renderErrors = errors => {
    return errors.map((err, i) => <Error key={i}>{err.message}</Error>)
  }

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e, addBudget) => {
    e.preventDefault()
    addBudget()
      .then(async ({ data }) => {
        if (data && data.addBudget) {
          let { _id, month } = data.addBudget
          let newBudget = { _id, month }
          setBudgets([newBudget, ...budgets])
          alert.fire('Budget Created!', `You have successfull created a budget for ${newBudget.month}`, 'success')
          closeForm(false)
        }
      })
      .catch(e => {})
  }

  return (
    <Mutation
      mutation={ADD_BUDGET}
      refetchQueries={() => {
        return [
          {
            query: GET_BUDGETS,
            variables: { creator: user._id }
          }
        ]
      }}
      variables={{ creator: user._id, month: `${formValues.month}-${formValues.year}` }}
    >
      {(addBudget, { error }) => {
        if (error) {
          setShowErrors(true)
        } else {
          setShowErrors(false)
        }
        return (
          <FormContainer>
            <Close onClick={() => closeForm(false)}>
              <i className='fas fa-times icon' />
              Cancel
            </Close>
            <h1>Create A New Budget</h1>
            {error && showErrors && renderErrors(error.graphQLErrors)}
            <Form onSubmit={e => handleSubmit(e, addBudget)}>
              <label htmlFor='month'>Select Month</label>
              <Select id='month' name='month' onChange={handleChange} value={formValues.month}>
                <option value='January'>January</option>
                <option value='February'>February</option>
                <option value='March'>March</option>
                <option value='April'>April</option>
                <option value='May'>May</option>
                <option value='June'>June</option>
                <option value='July'>July</option>
                <option value='August'>August</option>
                <option value='September'>September</option>
                <option value='October'>October</option>
                <option value='November'>November</option>
                <option value='December'>December</option>
              </Select>
              <label htmlFor='year'>Select Year</label>
              <Select id='year' name='year' onChange={handleChange} value={formValues.year}>
                {renderYearOptions()}
              </Select>
              <Submit type='submit'>Create</Submit>
            </Form>
          </FormContainer>
        )
      }}
    </Mutation>
  )
}

const Close = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  outline: none;
  border-radius: 5px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 16px;
  margin: 2em;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: #333;
  }
  .icon {
    margin-right: 8px;
  }
`

export const Error = styled.div`
  background-color: ${props => props.theme.errorBackground};
  color: ${props => props.theme.errorText};
  width: 350px;
  text-align: center;
  padding: 16px;
  border-radius: 5px;
  margin-top: 16px;
  font-size: 14px;
`

export const Submit = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #333;
  color: white;
  margin-top: 12px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`

const FormContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 3em;
  background-color: white;
  border: 1px solid #dcdcdc;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  @media (max-width: 425px) {
    padding: 100px 1em;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;

  label {
    margin-bottom: 5px;
  }
`

const Select = styled.select`
  width: 100%;
  min-width: 250px;
  height: 40px;
  background-color: white;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  border-radius: none;
  cursor: pointer;
  &:first-of-type {
    margin-bottom: 8px;
  }
`

export default NewBudgetForm

NewBudgetForm.propTypes = {
  budgets: propTypes.array,
  setBudgets: propTypes.func,
  closeForm: propTypes.func
}
