import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
const Home = lazy(() => import('./components/Home'))
const Register = lazy(() => import('./components/Register'))
const Login = lazy(() => import('./components/Login'))

function AppRouter () {
  return (
    <Suspense fallback='Loading...'>
      <Router>
        <Switch>
          <ProtectedRoute component={Home} exact path='/' />
          <Route component={Register} exact path='/register' />
          <Route component={Login} exact path='/login' />
          <ProtectedRoute component={Home} />
        </Switch>
      </Router>
    </Suspense>
  )
}

export default AppRouter
