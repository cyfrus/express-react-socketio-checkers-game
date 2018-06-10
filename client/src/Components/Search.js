import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import axios from 'axios';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opponent: "player",
            duration: "10",
          };
        this.handleSubmit  = this.handleSubmit.bind(this);
        this.selectOpponent = this.selectOpponent.bind(this);
        this.changeDuration = this.changeDuration.bind(this);
    }

    selectOpponent(event) {
        this.setState({
            opponent : event.target.name
        });

    }

    changeDuration(event) {
        this.setState({
            duration : event.target.value
        })
    }

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        return (
        <div className="row">
        <div className="col-md-5">
          <h4 className="searchTitle">Search for game</h4>
          <div>
            <div className="form-group">
              <button onClick={this.selectOpponent} name="ai" className={this.state.opponent === "ai" ? 'aiButton active' : 'aiButton'}>Play against AI</button>
              <button onClick={this.selectOpponent} name="player" className={this.state.opponent === "player" ? 'playerButton active' : 'playerButton'}>Play against other player</button>
              <input type="hidden" value={this.state.opponent} name="opponent"/>
            </div>
    
            <select className="form-control" id="turnDurationSelect" name="duration" onChange={this.changeDuration}>
              <option value="10">10 Seconds</option>
              <option value="20">20 Seconds</option>
              <option value="60">60 Seconds</option>
              <option value="120">120 Seconds</option>
            </select>
          </div>
          <button className="btn btn-success form-control searchbutton" onClick={this.handleSubmit}>Search</button>
        </div>
      </div>
    );
    }
}
  

export default Search;
