import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import { ApolloProvider } from 'react-apollo'
import { client } from './network/apollo-client'
import { Provider } from 'react-redux'
import store from './store'
import ErrorBoundary from './ErrorBoundary'

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </ApolloProvider>
  </Provider>,
  document.getElementById('react-app')
)
