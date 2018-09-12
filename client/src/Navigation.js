import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import Login, {authenticated} from './Components/Login';
import Home from './Components/Home';
import Tournaments from './Components/Tournaments';
import About from './Components/About';
import Rules from './Components/Rules';
import Search from './Components/Search';
import Game from './Components/GameComponents/Game';
import Profile from './Components/Profile';
import Registration from './Components/Registration';
import EditProfile from './Components/EditProfile';

const Navigation = () => (
  <Router>
    <div className="navContainer">
      <PrivateRoute path="/search" component={Search} />
      <PrivateRoute exact path="/" component={Home} />
      <PublicRoute path="/login" component={Login} />
      <PrivateRoute path="/stats" component={Tournaments} />
      <PrivateRoute path="/rules" component={Rules} />
      <PrivateRoute path="/about" component={About} />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute exact path="/edit" component={EditProfile} />
      <PublicRoute path="/registration" component={Registration} />
      <PrivateRoute path="/game/:gameId" component={Game} />
      <div className="signOut"><AuthButton /></div>
    </div>
  </Router>
);


const AuthButton = withRouter(
  ({ history }) =>
    sessionStorage.getItem("authenticated") === "yes" ? (
      <p>
        <button
          onClick={() => {
            sessionStorage.clear();
            history.push('/login');
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <div>You are not logged in.</div>
    )
)


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render = { props =>
      sessionStorage.getItem('username') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);


const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render = { props =>
      !sessionStorage.getItem('username') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);


export default Navigation;
