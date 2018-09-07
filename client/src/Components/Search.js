import React from "react";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opponent: "player",
      duration: "10",
      gameID: "",
      gameStatus: null,
      gameModeDescriptionPlayer: "Play against another player randomly found. Every game counts and win adds you 25 points to your MMR (Match making ratio), losing the match removes 25 points from your existing MMR. MMR can not go lower than 0.",
      gameModeDescriptionAI: "Play against computer that randomly moves pieces. This game mode serves as practice to new players that maybe are not that familiar with checkers."
    };
    this.startSearch = this.startSearch.bind(this);
    this.selectOpponent = this.selectOpponent.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
    this.stopSearch = this.stopSearch.bind(this);
    this.acceptGame = this.acceptGame.bind(this);
    this.declineGame = this.declineGame.bind(this);
  }

  componentDidUpdate(prevProps) {
    socket.on(
      "foundGame",
      function(data) {
        this.setState({
          gameID: data.game
        });
      }.bind(this)
    );
  }

  selectOpponent(event) {
    this.setState({
      opponent: event.target.name
    });
  }

  changeDuration(event) {
    this.setState({
      duration: event.target.value
    });
  }

  declineGame() {
    this.setState({
      searching: false,
      gameID: ""
    });
    socket.emit("declined");
    console.log("declined");
  }

  stopSearch(event) {
    console.log("stop searching!");
    this.setState({
      searching: false
    });
    socket.emit("stopSearch", {});
  }

  startSearch(event) {
    this.setState({
      searching: true
    });
    console.log("handle submit!");
    socket.emit("search", {
      opponent: this.state.opponent,
      duration: this.state.duration
    });
  }
  acceptGame() {
    this.setState({
      gameStatus: "ready"
    });
    socket.emit("accepted");
  }
  render() {
    let description;
      if(this.state.opponent === "player") {
        description = 
        <div className="descriptionDiv">
          <p>{this.state.gameModeDescriptionPlayer}</p>
        </div>
      } else {
        <div className="descriptionDiv">
          <p>{this.state.gameModeDescriptionAI}</p>
        </div>  
      }
    if (this.state.gameStatus === "ready") {
      return <Redirect to={"/game/" + this.state.gameID} />;
    }
    if (!this.state.searching) {
      return (
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h4 className="searchTitle">Search for game</h4>
            <div>
              <div className="form-group">
                <button
                  onClick={this.selectOpponent}
                  name="ai"
                  className={
                    this.state.opponent === "ai"
                      ? "aiButton active"
                      : "aiButton"
                  }
                >
                  Play against AI
                </button>
                <button
                  onClick={this.selectOpponent}
                  name="player"
                  className={
                    this.state.opponent === "player"
                      ? "playerButton active"
                      : "playerButton"
                  }
                >
                  Play against other player
                </button>
                <input
                  type="hidden"
                  value={this.state.opponent}
                  name="opponent"
                />
              </div>

              <select
                className="form-control"
                id="turnDurationSelect"
                name="duration"
                onChange={this.changeDuration}
              >
                <option value="10">10 Seconds</option>
                <option value="20">20 Seconds</option>
                <option value="60">60 Seconds</option>
                <option value="120">120 Seconds</option>
              </select>
            </div>
            <button
              className="btn btn-success form-control searchbutton"
              onClick={this.startSearch}
            >
              Search
            </button>
            {description}
          </div>
         
        </div>
      );
    } else if (this.state.gameID !== "") {
      return (
        <div className="text-center">
          <h4 className="">Found the opponent</h4>
          <button className="accept-btn" onClick={this.acceptGame}>
            Accept
          </button>
          <button className="decline-btn" onClick={this.declineGame}>
            Decline
          </button>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h4 className="searchTitle">Searching for game</h4>
            <button
              className="btn btn-danger form-control searchbutton"
              onClick={this.stopSearch}
            >
              Stop searching
            </button>
            {description}
          </div>
        </div>
      );
    }
  }
}

export default Search;
export { socket as Socket };
