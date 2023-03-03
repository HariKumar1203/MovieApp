import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    isError: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    this.setState({isError: false})
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, isError: true})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, isError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677689381/Group_7399logo_elchxl.png"
          alt="login website logo"
          className="company-image"
        />
        <div className="card">
          <div className="login-card-container">
            <h1 className="heading-login">Login</h1>
            <form className="form-container" onSubmit={this.onSubmit}>
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <input
                className="login-input"
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={this.updateUsername}
              />
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="login-input"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={this.updatePassword}
              />
              <p className="error">{isError && `* ${errorMsg}`}</p>
              <div>
                <button className="login-button" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
