import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './routes'
import { ApolloProvider } from '@apollo/react-hooks'
import { client } from './network/apollo-client'
import ErrorBoundary from './ErrorBoundary'
import { UserProvider } from './context/auth'

ReactDOM.render(
  <UserProvider>
    <Router>
      <ApolloProvider client={client}>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </ApolloProvider>
    </Router>
  </UserProvider>,
  document.getElementById('react-app')
)
