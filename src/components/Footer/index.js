import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="icons-container">
      <FaGoogle size="20" className="icon" />
      <FaTwitter size="20" className="icon" />
      <FaInstagram size="20" className="icon" />
      <FaYoutube size="20" />
    </div>
    <p className="footer-para">Contact us</p>
  </div>
)
export default Footer
