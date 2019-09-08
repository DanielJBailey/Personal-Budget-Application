import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import { SIGNIN_USER } from '../../queries/index'
import propTypes from 'prop-types'
import { useAuth } from '../../context/auth'

const initialState = {
  username: '',
  password: ''
}

export const Login = ({ history }) => {
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
          await window.localStorage.removeItem('current-budget')
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
    <Container>
      <h1 data-testid='sign-in-header'>Sign In</h1>
      <h2 data-testid='welcome'>Welcome back, we missed you.</h2>
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
                  data-testid='username'
                  name='username'
                  onChange={handleChange}
                  placeholder='Username'
                  required
                />
                <input
                  aria-label='password field'
                  autoComplete='password'
                  data-testid='password'
                  name='password'
                  onChange={handleChange}
                  placeholder='Password'
                  required
                  type='password'
                />
                <Submit type='submit'>Submit</Submit>
              </Form>
            </>
          )
        }}
      </Mutation>
      <h3 data-testid='sign-up-link'>
        {"Don't have an account?"} <Link to='/register'>Sign up</Link>
      </h3>
    </Container>
  )
}

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

export const Container = styled.div`
  height: 100%;
  min-height: calc(100vh - 100px);
  width: 100%;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
    position: relative;
    z-index: 3;
    &::after {
      width: 100%;
      content: '';
      display: block;
      position: absolute;
      bottom: -2px;
      left: 0;
      height: 5px;
      z-index: 1;
      background-color: #1dd1a1;
      opacity: 0.4;
    }
    &:hover::after {
      height: 10px;
      opacity: 0.5;
    }
  }

  h1 {
    font-size: 48px;
    font-weight: bold;
  }
  h2 {
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 24px;
  }

  h3 {
    font-size: 14px;
    font-weight: normal;
    margin-top: 12px;
  }

  @media (max-width: 425px) {
    padding: 2em;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;

  input {
    padding: 16px;
    border: none;
    background-color: white;
    font-size: 16px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
`

export const Error = styled.div`
  background-color: ${props => props.theme.errorBackground};
  color: ${props => props.theme.errorText};
  width: 350px;
  text-align: center;
  padding: 16px;
  border-radius: 5px;
  margin: 0 0 12px 0;
  font-size: 14px;
`

export default withRouter(Login)

Login.propTypes = {
  history: propTypes.object
}
