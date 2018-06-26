import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import Login, {authenticated} from './Components/Login';
import Home from './Components/Home';
import Tournaments from './Components/Tournaments';
import About from './Components/About';
import Rules from './Components/Rules';
import Search from './Components/Search';
import Game from './Components/GameComponents/Game';

const Navigation = () => (
  <Router>
    <div className="navContainer">
      <PrivateRoute path="/search" component={Search} />
      <PrivateRoute exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/tournaments" component={Tournaments} />
      <PrivateRoute path="/rules" component={Rules} />
      <PrivateRoute path="/about" component={About} />
      <Route path="/game/:gameId" component={Game} />
    </div>
  </Router>
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
