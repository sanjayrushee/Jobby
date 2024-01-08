import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMessage: false,
    errorMessage: '',
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jswToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jswToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFails = erroMsg => {
    this.setState({showErrorMessage: true, errorMessage: erroMsg})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFails(data.error_msg)
    }
  }

  renderUserName = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          Username
        </label>

        <input
          type="text"
          id="username"
          placeholder="UserName"
          className="username-input"
          value={username}
          onChange={this.onChangeUserName}
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="password-input"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {showErrorMessage, errorMessage} = this.state
    return (
      <div className="background">
        <form onSubmit={this.onSubmitLogin} className="form-Container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="input-container">{this.renderUserName()}</div>

          <div className="input-container">{this.renderPassword()}</div>

          <button type="submit" className="Login-btn">
            Login
          </button>
          <div className="error-container">
            {showErrorMessage ? (
              <p className="error-msg">*{errorMessage}</p>
            ) : (
              ''
            )}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
