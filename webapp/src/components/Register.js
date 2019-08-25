import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import { SIGNUP_USER } from '../queries/index'
import propTypes from 'prop-types'
import { useAuth } from '../context/auth'

const initialState = {
  username: '',
  password: '',
  passwordConfirmation: ''
}

const Register = ({ history }) => {
  const [formValues, setFormValues] = useState({ ...initialState })
  const [showErrors, setShowErrors] = useState(false)
  const [errors, setErrors] = useState([])
  const { user, setUser } = useAuth()

  useEffect(() => {
    if (user._id) {
      history.goBack()
    }
  }, [])

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const formValidation = () => {
    const { password, passwordConfirmation } = formValues
    if (password !== passwordConfirmation) {
      setErrors([...errors, { message: 'Passwords do not match.' }])
    }
    if (password.length <= 7) {
      setErrors([...errors, { message: 'Password must be atleast 8 characters.' }])
    }
    if (errors.length > 0) {
      setShowErrors(true)
      return false
    } else return true
  }

  const handleSubmit = async (e, signUpUser) => {
    e.preventDefault()
    if (formValidation()) {
      signUpUser().then(async ({ data }) => {
        if (data && data.addUser) {
          const { token, _id, username } = data.addUser
          await window.localStorage.removeItem('budget-auth')
          await window.localStorage.setItem('budget-auth', token)
          setUser({ username, _id })
          history.push('/')
        }
      })
    }
  }

  const renderErrors = errors => {
    return errors.map((err, i) => <Error key={i}>{err.message}</Error>)
  }

  return (
    <>
      <Mutation mutation={SIGNUP_USER} variables={formValues}>
        {(signUpUser, { data, loading, error }) => {
          if (error) {
            setShowErrors(true)
          } else {
            setShowErrors(false)
          }
          return (
            <>
              {error && showErrors && renderErrors(error.graphQLErrors)}
              {showErrors && renderErrors(errors)}
              <Form onSubmit={e => handleSubmit(e, signUpUser)}>
                <input
                  aria-label='username field'
                  autoComplete='username'
                  name='username'
                  onChange={handleChange}
                  placeholder='Username:'
                  required
                />
                <input
                  aria-label='password field'
                  autoComplete='password'
                  name='password'
                  onChange={handleChange}
                  placeholder='Password:'
                  required
                  type='password'
                />
                <input
                  aria-label='password confirmation field'
                  autoComplete='password confirmation'
                  name='passwordConfirmation'
                  onChange={handleChange}
                  placeholder='Password Confirm:'
                  required
                  type='password'
                />
                <button type='submit'>Submit</button>
              </Form>
            </>
          )
        }}
      </Mutation>
    </>
  )
}

const Form = styled.form``

const Error = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  color: maroon;
  width: 450px;
  text-align: center;
  padding: 16px;
  border-radius: 5px;
  margin: 0 0 24px 0;
`

export default withRouter(Register)

Register.propTypes = {
  history: propTypes.object
}
