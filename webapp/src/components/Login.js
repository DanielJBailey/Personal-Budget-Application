import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import { SIGNIN_USER } from '../queries/index'
import propTypes from 'prop-types'
import { useAuth } from '../context/auth'

const initialState = {
  username: '',
  password: ''
}

const Login = ({ history }) => {
  const [formValues, setFormValues] = useState({ ...initialState })
  const [showErrors, setShowErrors] = useState(false)
  const { user, setUser } = useAuth()

  useEffect(() => {
    if (user._id) {
      history.goBack()
    }
  }, [])

  const handleChange = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e, signInUser) => {
    e.preventDefault()
    signInUser()
      .then(async ({ data }) => {
        if (data && data.signInUser) {
          const { token, _id, username } = data.signInUser
          await window.localStorage.removeItem('budget-auth')
          await window.localStorage.setItem('budget-auth', token)
          setUser({ username, _id })
          history.push('/')
        }
      })
      .catch(e => {})
  }

  const renderErrors = errors => {
    return errors.map((err, i) => <Error key={i}>{err.message}</Error>)
  }

  return (
    <>
      <Mutation mutation={SIGNIN_USER} variables={formValues}>
        {(signInUser, { data, loading, error }) => {
          if (error) {
            setShowErrors(true)
          } else {
            setShowErrors(false)
          }
          return (
            <>
              {error && showErrors && renderErrors(error.graphQLErrors)}
              <Form onSubmit={e => handleSubmit(e, signInUser)}>
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

export default withRouter(Login)

Login.propTypes = {
  history: propTypes.object
}
