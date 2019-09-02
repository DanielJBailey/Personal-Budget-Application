import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import FetchUser from './components/FetchUser'
const Home = lazy(() => import('./components/Home'))
const Register = lazy(() => import('./components/Register'))
const Login = lazy(() => import('./components/Login'))
const Nav = lazy(() => import('./components/NavBar'))
const Category = lazy(() => import('./components/Category'))

function AppRouter () {
  return (
    <Suspense fallback='Loading...'>
      <Nav />
      <FetchUser>
        <Switch>
          <ProtectedRoute component={Home} exact path='/' />
          <ProtectedRoute component={Category} exact path='/category/:categoryName' />
          <Route component={Register} exact path='/register' />
          <Route component={Login} exact path='/login' />
        </Switch>
      </FetchUser>
    </Suspense>
  )
}

export default AppRouter
