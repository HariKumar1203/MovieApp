import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Footer from '../Footer'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class movieItemDetails extends Component {
  state = {
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
    display: false,
  }

  componentDidMount() {
    this.getMoviesData()
  }

  getMoviesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const newList = {
        movieDetails: {
          adult: data.movie_details.adult,
          backdropPath: data.movie_details.backdrop_path,
          budget: data.movie_details.budget,
          id: data.movie_details.id,
          overview: data.movie_details.overview,
          posterPath: data.movie_details.poster_path,
          releaseDate: data.movie_details.release_date,
          runtime: data.movie_details.runtime,
          title: data.movie_details.title,
          voteAverage: data.movie_details.vote_average,
          voteCount: data.movie_details.vote_count,
          genres: data.movie_details.genres.map(each => ({
            id: each.id,
            name: each.name,
          })),
          similarMovies: data.movie_details.similar_movies.map(each => ({
            backdropPath: each.backdrop_path,
            posterPath: each.poster_path,
            id: each.id,
            title: each.title,
          })),
          spokenLanguages: data.movie_details.spoken_languages.map(each => ({
            id: each.id,
            englishName: each.english_name,
          })),
        },
      }
      this.setState({
        moviesList: newList,
        apiStatus: apiStatusConstants.success,
        display: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMovieLoadingView = () => (
    <>
      <Header />
      <div className="movies-loader-container" testid="loader">
        <Loader type="TailSpin" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  tryAgainMovie = () => {
    this.getMoviesData()
  }

  renderMovieFailureView = () => (
    <>
      <Header />
      <div className="movies-failure-container">
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
          onClick={this.tryAgainMovie}
        >
          Try Again
        </button>
      </div>
    </>
  )

  renderMovieSuccessView = () => {
    const {moviesList, display} = this.state
    const Image = display ? moviesList.movieDetails.posterPath : ''
    const year = moviesList.movieDetails.releaseDate.split('-')

    return (
      <div className="movies-success-container">
        <div style={{backgroundImage: `url(${Image})`}} className="background">
          <Header />
          <div className="movie-details-container">
            <h1 className="movie-heading">{moviesList.movieDetails.title}</h1>
            <div className="time-year-container">
              <p>{moviesList.movieDetails.runtime}m</p>
              <p>U/A</p>
              <p>{year[0]}</p>
            </div>
            <p className="home-para">{moviesList.movieDetails.overview}</p>
            <button type="button" className="play-button">
              Play
            </button>
          </div>
        </div>
        <div className="movie-body-container">
          <div className="filter-container">
            <div className="container">
              <h1 className="movie-body-heading">genres</h1>
              <ul className="genre-list">
                {moviesList.movieDetails.genres.map(each => (
                  <li className="list-genres" key={each.id}>
                    <p className="movie-body-para">{each.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="container">
              <h1 className="movie-body-heading">Audio Available</h1>
              <ul className="genre-list">
                {moviesList.movieDetails.spokenLanguages.map(each => (
                  <li className="list-genres" key={each.id}>
                    <p className="movie-body-para">{each.englishName}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="container">
              <h1 className="movie-body-heading">Rating Count</h1>
              <p className="movie-body-para">
                {moviesList.movieDetails.voteCount}
              </p>
              <h1 className="movie-body-heading">Rating Average</h1>
              <p className="movie-body-para">
                {moviesList.movieDetails.voteAverage}
              </p>
            </div>
            <div className="container">
              <h1 className="movie-body-heading">Budget</h1>
              <p className="movie-body-para">
                {moviesList.movieDetails.budget}
              </p>
              <h1 className="movie-body-heading">Release Date</h1>
              <p className="movie-body-para">
                {moviesList.movieDetails.releaseDate}
              </p>
            </div>
          </div>
          <h1 className="more-heading">More like this</h1>
          <ul className="more-list">
            {moviesList.movieDetails.similarMovies.map(each => (
              <li className="list-more" key={each.id}>
                <img
                  src={each.posterPath}
                  alt={each.title}
                  className="more-image"
                />
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    )
  }

  renderMovieItemsResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMovieSuccessView()
      case apiStatusConstants.failure:
        return this.renderMovieFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMovieLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="movie-item-container">
        {this.renderMovieItemsResult()}
      </div>
    )
  }
}
export default movieItemDetails
