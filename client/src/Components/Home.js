import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfPlayers: 0
    }
  }

  componentDidMount() {
    axios.get('/getNumOfPlayers')
    .then(function (response) {
      console.log(response);
        this.setState({
          numberOfPlayers : response.data.numberOfPlayers,
          error: response.data.auth ? "" : "Incorrect username or password!"
        });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return(
    <div className = "list_menuDiv">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <ul className="list_menu">
            <h1 className="menu_title">Checkers</h1>
              <li>
                <Link to="/search">New Game</Link>
              </li>
              <li>
                <Link to="/stats">Statistics</Link>
              </li>
              <li>
                <Link to="/rules">Rules</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row infoBannerRow">
          <div className="col-md-6 infoBanner">
          <div className="">
            <p className="brag-paragraph">The best website for playing checkers online. Playing is easy, quick and simple.</p>
          </div>
          </div>
          <div className="col-md-6 infoBanner2">
            <p className="brag-paragraph">Number of players registered on website: <span>{this.state.numberOfPlayers}</span></p>
            <p className="brag-paragraph">
            Number of matches played: 
            </p>
          </div>
        </div>
      </div>
    );
  };
}


export default Home;
