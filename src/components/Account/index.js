import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const Account = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="account-container">
      <Header />
      <div className="account-body">
        <div className="account-details">
          <h1 className="account-heading">Account</h1>
          {/* <hr style={{color: '#CBD5E1'}} /> */}
          <div className="account-holder">
            <p className="membership">Member ship</p>
            <div className="account-profile">
              <p className="email">rahul@gmaiil.com</p>
              <p className="password">Password : ************</p>
            </div>
          </div>
          <div className="plan-details">
            <p className="membership">Plan details</p>
            <div className="account-profile-type">
              <p className="email">Premium</p>
              <p className="type">Ultra HD</p>
            </div>
          </div>
          <div className="button-container">
            <button type="button" className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Account
