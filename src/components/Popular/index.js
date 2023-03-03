import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {
    popularList: [],
    apiStatus: apiStatusConstants.initial,
    homeActive: false,
    popularActive: true,
  }

  componentDidMount() {
    this.getPopularData()
  }

  getPopularData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
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
        popularList: newList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderPopularSuccessView = () => {
    const {popularList} = this.state
    return (
      <>
        <ul className="popular-body">
          {popularList.map(each => (
            <li className="list-images" key={each.id}>
              <Link to={`/movies/${each.id}`} style={{textDecoration: 'none'}}>
                <img
                  src={each.posterPath}
                  alt={each.title}
                  className="list-movie-image"
                />
              </Link>
            </li>
          ))}
        </ul>
        <Footer />
      </>
    )
  }

  renderPopularLoadingView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#ffffff" height="40" width="40" />
    </div>
  )

  tryAgainPopular = () => {
    this.getPopularData()
  }

  renderPopularFailureView = () => (
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

  renderPopularResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularSuccessView()
      case apiStatusConstants.failure:
        return this.renderPopularFailureView()
      case apiStatusConstants.inProgress:
        return this.renderPopularLoadingView()
      default:
        return null
    }
  }

  render() {
    const {homeActive, popularActive} = this.state
    return (
      <div className="popular-container">
        <Header homeActive={homeActive} popularActive={popularActive} />
        {this.renderPopularResult()}
      </div>
    )
  }
}
export default Popular
