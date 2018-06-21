import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import Login, {authenticated} from './Components/Login';
import Home from './Components/Home';
import Tournaments from './Components/Tournaments';
import About from './Components/About';
import Rules from './Components/Rules';
import Search from './Components/Search';

const Navigation = () => (
  <Router>
    <div className="">
      <PrivateRoute path="/search" component={Search} />
      <PrivateRoute exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/tournaments" component={Tournaments} />
      <PrivateRoute path="/rules" component={Rules} />
      <PrivateRoute path="/about" component={About} />
      <PrivateRoute path="/game/:gameId" component={Game} />
    </div>
  </Router>
);

const Game = () => (
  <h3>Game</h3>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render = { props =>
      authenticated ? (
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


export default Navigation;
