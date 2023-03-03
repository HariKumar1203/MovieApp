import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'

import MoviesSlider from '../MoviesSlider'
import Footer from '../Footer'
import Header from '../Header'
import TrendingList from '../TrendingList'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    originalList: [],
    posterList: [],
    apiStatus: apiStatusConstants.initial,
    display: false,
    homeActive: true,
    popularActive: false,
  }

  componentDidMount() {
    this.getOriginalsData()
  }

  getOriginalsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/originals'
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
      const index = Math.floor(Math.random() * newList.length)
      this.setState({
        posterList: newList[index],
        originalList: newList,
        apiStatus: apiStatusConstants.success,
        display: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="poster-loader-container" testid="loader">
      <Loader type="TailSpin" color="#ffffff" height="40" width="40" />
    </div>
  )

  tryAgain = () => {
    this.getOriginalsData()
  }

  renderFailureView = () => (
    <div className="trending-failure-container">
      <img
        src="https://res.cloudinary.com/dtcwz5jv9/image/upload/v1677688713/alert-trianglefailure_1_xxl5em.png"
        alt="failure view"
        className="alert-icon"
      />
      <p className="failure-para">Something went wrong. Please try again</p>
      <button type="button" className="play-button" onClick={this.tryAgain}>
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {posterList} = this.state
    return (
      <div className="details-container">
        <h1 className="home-heading">{posterList.title}</h1>
        <p className="home-para">{posterList.overview}</p>
        <button type="button" className="play-button">
          Play
        </button>
      </div>
    )
  }

  renderPoster = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderOriginalLoadingView = () => (
    <div className="trending-loader-container" testid="loader">
      <Loader type="TailSpin" color="#ffffff" height="40" width="40" />
    </div>
  )

  renderOriginalFailureView = () => (
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
        onClick={this.tryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderOriginalSuccessView = () => {
    const {originalList} = this.state
    const settings = {
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    }
    return (
      <Slider {...settings} className="slider">
        {originalList.map(each => (
          <MoviesSlider key={each.id} details={each} />
        ))}
      </Slider>
    )
  }

  renderOriginalsResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderOriginalSuccessView()
      case apiStatusConstants.failure:
        return this.renderOriginalFailureView()
      case apiStatusConstants.inProgress:
        return this.renderOriginalLoadingView()
      default:
        return null
    }
  }

  render() {
    const {display, posterList, homeActive, popularActive} = this.state
    const Image = display ? posterList.posterPath : ''
    return (
      <div className="home-container">
        <div style={{backgroundImage: `url(${Image})`}} className="background">
          <Header homeActive={homeActive} popularActive={popularActive} />
          {this.renderPoster()}
        </div>
        <div>
          <h3 className="trending-heading">Trending Now</h3>
          <TrendingList />
          <h3 className="originals-heading">Originals</h3>
          {this.renderOriginalsResult()}
        </div>
        <Footer />
      </div>
    )
  }
}
export default Home
