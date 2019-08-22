import React from 'react'
import { connect } from 'react-redux'

const Login = () => <>Login</>

const mapStateToProps = state => {
  return { isAuthenticated: state.auth.id !== undefined }
}

export default connect(mapStateToProps)(Login)
