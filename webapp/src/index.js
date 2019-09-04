import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './routes'
import { ApolloProvider as HooksProvider } from '@apollo/react-hooks'
import { client } from './network/apollo-client'
import ErrorBoundary from './ErrorBoundary'
import { UserProvider } from './context/auth'
import { ApolloProvider } from 'react-apollo'
import { ThemeProvider } from 'emotion-theming'
import theme from './theme'

ReactDOM.render(
  <UserProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <ApolloProvider client={client}>
          <HooksProvider client={client}>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </HooksProvider>
        </ApolloProvider>
      </Router>
    </ThemeProvider>
  </UserProvider>,
  document.getElementById('react-app')
)
