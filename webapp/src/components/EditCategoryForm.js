import React, { useState, useEffect } from 'react'
import posed from 'react-pose'
import { Mutation } from 'react-apollo'
import { UPDATE_CATEGORY, GET_CATEGORY, GET_CATEGORIES, GET_TRANSACTIONS } from '../queries/index'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useAuth } from '../context/auth'
import alert from 'sweetalert2'

const initialState = {
  name: '',
  description: '',
  starting_balance: 0
}

const EditCategoryForm = ({ editing, category, setEditing }) => {
  const [formValues, setFormValues] = useState({ ...initialState })
  const [showErrors, setShowErrors] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (category && category._id) {
      setFormValues({
        name: category.name,
        description: category.description,
        starting_balance: category.starting_balance
      })
    }
  }, [category])

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = (e, updateCategory) => {
    e.preventDefault()
    updateCategory().then(async ({ data, loading }) => {
      if (!loading && data && data.updateCategory) {
        alert.fire(
          'Category Updated!',
          `You have successfully updated the category for ${data.updateCategory.name}.`,
          'success'
        )
        setEditing(false)
      }
    })
  }

  const renderErrors = errors => {
    return errors.map((err, i) => <Error key={i}>{err.message}</Error>)
  }

  return (
    <Mutation
      mutation={UPDATE_CATEGORY}
      refetchQueries={() => {
        return [
          {
            query: GET_CATEGORIES,
            variables: { user_id: user._id, budget_id: category.budget_id }
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
        _id: category._id,
        name: formValues.name,
        description: formValues.description,
        starting_balance: parseFloat(formValues.starting_balance)
      }}
    >
      {(updateCategory, { error }) => {
        if (error) {
          setShowErrors(true)
        } else {
          setShowErrors(false)
        }
        return (
          <EditForm pose={editing ? 'open' : 'closed'}>
            <h1>Edit Category</h1>
            <Form onSubmit={e => handleSubmit(e, updateCategory)}>
              {error && showErrors && renderErrors(error.graphQLErrors)}
              <label htmlFor='name'>Category Name</label>
              <input
                id='name'
                name='name'
                onChange={handleChange}
                placeholder='Category Name'
                required
                value={formValues.name}
              />
              <label htmlFor='starting_balance'>Starting Balance</label>
              <input
                id='starting_balance'
                min={0}
                name='starting_balance'
                onChange={handleChange}
                placeholder='Starting Balance'
                required
                step={0.01}
                type='number'
                value={formValues.starting_balance}
              />
              <label htmlFor='description'>Category Description</label>

              <input
                id='description'
                name='description'
                onChange={handleChange}
                placeholder='Description'
                value={formValues.description}
              />
              <Submit type='submit'>
                <i className='fas fa-check icon' />
                Submit
              </Submit>
              <Cancel onClick={() => setEditing(false)} type='button'>
                <i className='fas fa-times icon' />
                Cancel
              </Cancel>
            </Form>
          </EditForm>
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
  margin-bottom: 8px;
  &:hover {
    background-color: #333;
    color: white;
  }

  .icon {
    margin-right: 8px;
  }
`

const Cancel = styled.button`
  height: 40px;
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid #ee5253;
  color: #ee5253;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;

  .icon {
    margin-right: 8px;
  }

  &:hover {
    background-color: #ee5253;
    color: white;
  }
`

const Form = styled.form`
  width: 100%;
  max-width: 300px;
  margin-top: 24px;

  label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    margin-bottom: 12px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    margin-top: 5px;
  }
`

const AnimatedEditForm = posed.div({
  open: {
    marginRight: 0,
    transition: {
      duration: 500
    }
  },
  closed: {
    transition: {
      duration: 500
    },
    marginRight: '-100%'
  }
})

const EditForm = styled(AnimatedEditForm)`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: auto;
  background-color: white;
  z-index: 11;
  box-shadow: -2px -2px 8px rgba(0, 0, 0, 0.1);
  padding: 2em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

EditCategoryForm.propTypes = {
  editing: propTypes.bool,
  category: propTypes.object,
  setEditing: propTypes.func
}

export default EditCategoryForm
