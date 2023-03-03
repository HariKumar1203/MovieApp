import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
// import {RiAlertFill} from 'react-icons/ri'
import MoviesSlider from '../MoviesSlider'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TrendingList extends Component {
  state = {trendingList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getTrendingData()
  }

  getTrendingData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        overview: each.overview,
      }))
      this.setState({
        trendingList: newList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderTrendingLoadingView = () => (
    <div className="trending-loader-container" testid="loader">
      <Loader type="TailSpin" color="#ffffff" height="40" width="40" />
    </div>
  )

  tryAgainTrending = () => {
    this.getTrendingData()
  }

  renderTrendingFailureView = () => (
    <div className="trending-failure-container">
      <img
        src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677688713/alert-trianglefailure_1_xxl5em.png"
        alt="failure view"
        className="alert"
      />
      <p className="failure-para">Something went wrong. Please try again</p>
      <button
        type="button"
        className="play-button-originals"
        onClick={this.tryAgainTrending}
      >
        Try Again
      </button>
    </div>
  )

  renderTrendingSuccessView = () => {
    const {trendingList} = this.state
    const settings = {
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    }
    const settingsSmall = {
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    }
    return (
      <>
        <Slider {...settingsSmall} className="slider-small">
          {trendingList.map(each => (
            <MoviesSlider key={each.id} details={each} />
          ))}
        </Slider>
        <Slider {...settings} className="slider">
          {trendingList.map(each => (
            <MoviesSlider key={each.id} details={each} />
          ))}
        </Slider>
      </>
    )
  }

  renderTrendingResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTrendingSuccessView()
      case apiStatusConstants.failure:
        return this.renderTrendingFailureView()
      case apiStatusConstants.inProgress:
        return this.renderTrendingLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderTrendingResults()}</>
  }
}

export default TrendingList
