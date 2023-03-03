import {Route, Switch} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Popular from './components/Popular'
import Account from './components/Account'
import Search from './components/Search'
import movieItemDetails from './components/movieItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/popular" component={Popular} />
    <ProtectedRoute exact path="/account" component={Account} />
    <ProtectedRoute exact path="/movies/:id" component={movieItemDetails} />
    <ProtectedRoute exact path="/search" component={Search} />
    <Route component={NotFound} />
  </Switch>
)

export default App
