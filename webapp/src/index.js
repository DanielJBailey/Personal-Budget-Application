import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './routes'
import { ApolloProvider as HooksProvider } from '@apollo/react-hooks'
import { client } from './network/apollo-client'
import ErrorBoundary from './ErrorBoundary'
import { UserProvider } from './context/auth'
import { BudgetProvider } from './context/budget'
import { ApolloProvider } from 'react-apollo'

ReactDOM.render(
  <UserProvider>
    <BudgetProvider>
      <Router>
        <ApolloProvider client={client}>
          <HooksProvider client={client}>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </HooksProvider>
        </ApolloProvider>
      </Router>
    </BudgetProvider>
  </UserProvider>,
  document.getElementById('react-app')
)
