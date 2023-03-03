import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
// import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {
    searchList: [],
    inputValue: '',
    searchActive: true,
    apiStatus: apiStatusConstants.initial,
    homeActive: false,
    popularActive: false,
  }

  searchData = async search => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${search}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const newList = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
        id: each.id,
        title: each.title,
      }))
      this.setState({
        searchList: newList,
        apiStatus: apiStatusConstants.success,
        inputValue: search,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSearchSuccessView = () => {
    const {searchList, inputValue} = this.state
    return (
      <>
        {searchList.length === 0 ? (
          <div className="no-search-found-container">
            <img
              src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677836153/Layer_2noResult_xccadp.png"
              alt="no results"
              className="no-results-image"
            />
            <p className="search-result-para">
              Your search for {inputValue} did not find any matches.
            </p>
          </div>
        ) : (
          <ul className="popular-body">
            {searchList.map(each => (
              <li className="list-images" key={each.id}>
                <Link
                  to={`/movies/${each.id}`}
                  style={{textDecoration: 'none'}}
                >
                  <img
                    src={each.posterPath}
                    alt={each.title}
                    className="list-movie-image"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </>
    )
  }

  renderSearchLoadingView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#ffffff" height="40" width="40" />
    </div>
  )

  tryAgainPopular = () => {
    this.searchData()
  }

  renderSearchFailureView = () => (
    <div className="popular-failure-container">
      <img
        src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677693378/Background-Complete_hbshy9.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="popular-failure-para">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="play-button"
        onClick={this.tryAgainPopular}
      >
        Try Again
      </button>
    </div>
  )

  renderSearchResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchSuccessView()
      case apiStatusConstants.failure:
        return this.renderSearchFailureView()
      case apiStatusConstants.inProgress:
        return this.renderSearchLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchActive, homeActive, popularActive} = this.state
    return (
      <div className="popular-container">
        <Header
          searchActive={searchActive}
          searchData={this.searchData}
          homeActive={homeActive}
          popularActive={popularActive}
        />
        {this.renderSearchResult()}
      </div>
    )
  }
}
export default Popular
