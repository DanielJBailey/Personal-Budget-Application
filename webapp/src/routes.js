import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import FetchUser from './components/auth/FetchUser'
const Home = lazy(() => import('./components/dashboard/Home'))
const Register = lazy(() => import('./components/auth/Register'))
const Login = lazy(() => import('./components/auth/Login'))
const Nav = lazy(() => import('./components/reusable/NavBar'))
const Category = lazy(() => import('./components/category-view/Category'))

function AppRouter () {
  return (
    <Suspense fallback='Loading...'>
      <Nav />
      <FetchUser>
        <Switch>
          <ProtectedRoute component={Home} exact path='/' />
          <ProtectedRoute component={Category} exact path='/category/:category_id' />
          <Route component={Register} exact path='/register' />
          <Route component={Login} exact path='/login' />
        </Switch>
      </FetchUser>
    </Suspense>
  )
}

export default AppRouter
