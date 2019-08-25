import React from 'react'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

const Home = ({ history }) => {
  return (
    <Container>
      <h1>Dashboard</h1>
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default withRouter(Home)

Home.propTypes = {
  history: propTypes.object
}
