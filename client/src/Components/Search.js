import React from "react";
import {Redirect} from "react-router-dom";
import io from "socket.io-client";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opponent: "player",
      duration: "10",
      socket: io("http://localhost:3001"),
      gameID: "",
      gameStatus: null
    };
    this.startSearch = this.startSearch.bind(this);
    this.selectOpponent = this.selectOpponent.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
    this.stopSearch = this.stopSearch.bind(this);
    this.acceptGame = this.acceptGame.bind(this);
  }

  componentDidUpdate(prevProps) {
    this.state.socket.on("foundGame", function(data) {
      this.setState({
          gameID: data.game
      });
    }.bind(this));

    console.log(this.state.gameID);
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
  stopSearch() {
    this.setState({
      searching: false
    });
    this.state.socket.emit("stopSearch", {});
  }

  startSearch(event) {
    this.setState({
      searching: true
    });
    console.log("handle submit!");
    this.state.socket.emit("search", {
      opponent: this.state.opponent,
      duration: this.state.duration
    });
  }
  acceptGame() {
    this.setState({
        gameStatus: "ready"
    })
    this.state.socket.emit('accepted');
  }
  render() {
    if(this.state.gameStatus === "ready") {
      return(
        <Redirect to={"/game/" + this.state.gameID}/>
      );
    }
    if (!this.state.searching) {
      return (
        <div className="row">
          <div className="col-md-5">
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
          </div>
        </div>
      );
    } else if (this.state.gameID !== "") {
        return(
            <div className="text-center"> 
                <h4 className="">Found the opponent</h4>
                <button className="accept-btn" onClick={this.acceptGame}>Accept</button>
                <button className="decline-btn" onClick={this.declineGame}>Decline</button>
            </div>
        );
    } else {
      return (
        <div className="row">
          <div className="col-md-5">
            <h4>Searching for game</h4>
            <button
              className="btn btn-danger form-control"
              onClick={this.stopSearch}
            >
              Stop searching
            </button>
          </div>
        </div>
      );
    }
  }
}

export default Search;
