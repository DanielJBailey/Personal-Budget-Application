import React from 'react'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

const Home = ({ history }) => {
  return (
    <Container>
      <h1>January - 2019</h1>
    </Container>
  )
}

const Container = styled.div`
  min-height: calc(100vh - 100px);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2em 1em;
  max-width: 1140px;
  margin: 0 auto;
`

export default withRouter(Home)

Home.propTypes = {
  history: propTypes.object
}
