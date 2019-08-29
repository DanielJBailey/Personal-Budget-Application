import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useAuth } from '../context/auth'
import { Mutation } from 'react-apollo'
import { ADD_CATEGORY } from '../queries/index'
import propTypes from 'prop-types'
// import alert from 'sweetalert2'

const initialState = {
  name: '',
  description: '',
  starting_balance: ''
}

const NewCategoryForm = ({ currentBudget }) => {
  const [formValues, setFormValues] = useState({ ...initialState })
  const { user } = useAuth()

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = (e, addCategory) => {
    e.preventDefault()
    addCategory().then(async ({ data }) => {
      if (data && data.addCategory) {
        console.log(data)
      }
    })
  }

  return (
    <>
      {user && currentBudget && (
        <Mutation
          mutation={ADD_CATEGORY}
          variables={{
            ...formValues,
            starting_balance: parseInt(formValues.starting_balance),
            user_id: user._id,
            budget_id: currentBudget._id
          }}
        >
          {addCategory => {
            return (
              <Form onSubmit={e => handleSubmit(e, addCategory)}>
                <h4>Add Category</h4>
                <input
                  name='name'
                  onChange={handleChange}
                  placeholder='Category Name:'
                  required
                  value={formValues.name}
                />
                <input
                  name='starting_balance'
                  onChange={handleChange}
                  placeholder='Starting Balance:'
                  required
                  type='number'
                  value={formValues.starting_balance}
                />
                <input
                  name='description'
                  onChange={handleChange}
                  placeholder='Description:'
                  value={formValues.description}
                />
                <Submit type='submit'>Submit</Submit>
              </Form>
            )
          }}
        </Mutation>
      )}
    </>
  )
}

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
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #dcdcdc;
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
  }
`

export default NewCategoryForm

NewCategoryForm.propTypes = {
  currentBudget: propTypes.object
}
