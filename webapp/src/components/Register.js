import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { SIGNUP_USER } from '../queries/index'
import propTypes from 'prop-types'
import { useAuth } from '../context/auth'
import { Form, Container, Submit, Error } from './Login'

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
    <Container>
      <h1>Register</h1>
      <h2>{"You won't regret this decision."}</h2>
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
                <Submit type='submit'>Submit</Submit>
              </Form>
            </>
          )
        }}
      </Mutation>
      <h3>
        {'Already have an account?'} <Link to='/login'>Sign in</Link>
      </h3>
    </Container>
  )
}

export default withRouter(Register)

Register.propTypes = {
  history: propTypes.object
}
