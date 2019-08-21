import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import { ApolloProvider } from 'react-apollo'
import { client } from './network/apollo-client'
import { Provider } from 'react-redux'
import store from './store'
import ErrorBoundary from './ErrorBoundary'
import FetchUser from './components/FetchUser'

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ErrorBoundary>
        <FetchUser>
          <AppRouter />
        </FetchUser>
      </ErrorBoundary>
    </ApolloProvider>
  </Provider>,
  document.getElementById('react-app')
)
