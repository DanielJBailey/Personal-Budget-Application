import React from 'react'
import styled from '@emotion/styled'
import { Link, withRouter } from 'react-router-dom'
import { useAuth } from '../context/auth'
import propTypes from 'prop-types'

const NavBar = ({ history }) => {
  const { user, setUser } = useAuth()

  const logOutUser = async () => {
    await window.localStorage.removeItem('budget-auth')
    await window.localStorage.removeItem('current-budget')
    await setUser({})
    history.push('/login')
  }

  return (
    <Navigation>
      <Link to='/'>
        <Logo>
          Divvy<SmallTitle>Budget</SmallTitle>
        </Logo>
      </Link>
      {!user._id && (
        <UnAuth>
          <Link to='/register'>
            <NavItem register>Register</NavItem>
          </Link>
          <Link to='/login'>
            <NavItem>Log In</NavItem>
          </Link>
        </UnAuth>
      )}
      {user._id && <LogOut onClick={() => logOutUser()}>Log Out</LogOut>}
    </Navigation>
  )
}

const LogOut = styled.button`
  border: none;
  background-color: #333;
  color: white;
  padding: 16px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
`

const SmallTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
`

const Navigation = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #dcdcdc;
  padding: 1.5em;
  /* box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1); */
`

const UnAuth = styled.div`
  display: flex;
  align-items: center;
`

const NavItem = styled.button`
  cursor: pointer;
  height: 100%;
  padding: 16px;
  background-color: ${props => {
    if (props.register) return '#1dd1a1'
    else return '#333'
  }};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-right: ${props => {
    if (props.register) return '8px'
    else return '0'
  }};
  &:hover {
    opacity: 0.9;
  }
`

export default withRouter(NavBar)

NavBar.propTypes = {
  history: propTypes.object
}
