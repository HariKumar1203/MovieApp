import {Component} from 'react'
import {Link} from 'react-router-dom'

import {HiOutlineSearch} from 'react-icons/hi'

import './index.css'

class Header extends Component {
  state = {search: ''}

  onChangeSearch = event => {
    this.setState({search: event.target.value})
  }

  onClickSearch = () => {
    const {search} = this.state
    const {searchData} = this.props
    searchData(search)
  }

  render() {
    const {search} = this.state
    const {searchActive, homeActive, popularActive} = this.props
    const activeHome = homeActive ? 'isActive' : 'inActive'
    const activePopular = popularActive ? 'isActive' : 'inActive'
    return (
      <nav className="header-container">
        <ul className="text-container">
          <li>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677689381/Group_7399logo_elchxl.png"
                alt="website logo"
                className="company-logo-image"
              />
            </Link>
          </li>
          <li className="select-container">
            <p className={`listItems ${activeHome}`}>
              <Link to="/" className="link">
                Home
              </Link>
            </p>
            <p className={`listItems ${activePopular}`}>
              <Link to="/popular" className="link">
                Popular
              </Link>
            </p>
          </li>
        </ul>
        <div className="buttons-container">
          {searchActive ? (
            <div className="input-container">
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={this.onChangeSearch}
                className="input"
              />
              <button
                type="button"
                className="search-button"
                testid="searchButton"
                onClick={this.onClickSearch}
              >
                <HiOutlineSearch size="20" />
              </button>
            </div>
          ) : (
            <Link to="/search">
              <button type="button" className="button" testid="searchButton">
                <HiOutlineSearch size="20" />
              </button>
            </Link>
          )}
          <Link to="/account">
            <img
              src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677581801/Avatarprofile_1_p3ublk.png"
              alt="profile"
              className="image"
            />
          </Link>
        </div>
      </nav>
    )
  }
}
export default Header
