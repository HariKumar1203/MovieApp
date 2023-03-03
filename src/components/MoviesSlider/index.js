import {Link} from 'react-router-dom'
import './index.css'

const MoviesSlider = props => {
  const {details} = props
  const {posterPath, title, id} = details
  return (
    <Link to={`/movies/${id}`} style={{textDecoration: 'none'}}>
      <img src={posterPath} alt={title} className="trending-image" />
    </Link>
  )
}
export default MoviesSlider
