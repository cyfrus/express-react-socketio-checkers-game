import React from "react";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:3001");


function initialGameList () {
  axios.get('/getGames')
  .then(function (response) {
    // handle success
    console.log(response.data);
    if(response.data.length){
      return response.data;
    }
    return [];
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
});
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opponent: "player",
      duration: "10",
      gameID: "",
      gameStatus: null,
      gameModeDescriptionPlayer: "Play against another player randomly found. Every game counts and win adds you 25 points to your MMR (Match making ratio), losing the match removes 25 points from your existing MMR. MMR can not go lower than 0.",
      gameModeDescriptionAI: "Play against computer that randomly moves pieces. This game mode serves as practice to new players that maybe are not that familiar with checkers.",
      gameList: [],
      displayList: [],
      sliceIndex: 10,
    };
    this.startSearch = this.startSearch.bind(this);
    this.selectOpponent = this.selectOpponent.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
    this.stopSearch = this.stopSearch.bind(this);
    this.acceptGame = this.acceptGame.bind(this);
    this.declineGame = this.declineGame.bind(this);
    this.nextList = this.nextList.bind(this);
    this.previousList = this.previousList.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  componentDidMount() {
    axios.get('/getGames')
    .then(function (response) {
      // handle success
      console.log(response.data);
      this.setState({
        gameList: response.data
      })
    }.bind(this))
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    
    });
    socket.on("foundGame", (data) => {
        this.setState({
          gameID: data.game
        });
      });

    socket.on('updateGameList', (data) => {
      this.setState({
        gameList: data,
        displayList: data.slice(0, this.state.sliceIndex)
      }, () => {
        console.log(this.state.gameList);
      });
      
    });
  
    socket.on('startGame', (data) => {
      console.log(data);
      this.setState({
        gameID: data,
        gameStatus: "ready"
      });
    });

  }
  previousList(event) {
    let sliceIndex = this.state.sliceIndex,
        displayList = this.state.displayList.slice(),
        games = this.state.gameList;
        

    if(sliceIndex < 10) {
      sliceIndex = 10;
      displayList = games.slice(0, 10);
    } else {
      sliceIndex = sliceIndex - 10;
      displayList = games.slice(sliceIndex, this.state.sliceIndex);
    }
    
    this.setState({
      sliceIndex,
      displayList
    });
  }
  joinGame(match_id) {
    console.log("join game attempt");
    socket.emit('joinGame', { user_id: sessionStorage.getItem('id'), match_id: match_id });
  }
  nextList(event) {
    let sliceIndex = this.state.sliceIndex,
    displayList = this.state.displayList.slice(),
    games = this.state.gameList;
    
    if(sliceIndex + 10 > games.length) {
      displayList = games.slice(sliceIndex, games.length);
    } else {
      sliceIndex = sliceIndex + 10;
      displayList = games.slice(sliceIndex, sliceIndex + 10);
    }

    this.setState({
      sliceIndex,
      displayList
    });
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
    // socket.emit("search", {
    //   opponent: this.state.opponent,
    //   duration: this.state.duration
    // });
    socket.emit('createGame', {
      id: sessionStorage.getItem('id'),
      turn_time: this.state.duration
    });
  }
  acceptGame() {
    this.setState({
      gameStatus: "ready"
    });
    socket.emit("accepted");
  }
  render() {
    let gameList = this.state.displayList.map((game, index) => {
      return ( 
      <li key={game.game_ID} className="list-group-item gameListItem">
        <div>{game.game_ID}</div>
        <div>{game.username}</div>
        <div>{game.MMR}</div>
        <div><button className="btn btn-light" onClick={this.joinGame.bind(this, game.game_ID)}>Join</button></div>
        <div>Turn: {game.turn_time}</div> 
      </li>);
    });
    let description;
      if(this.state.opponent === "player") {
        description = 
        <div className="descriptionDiv">
          <p>{this.state.gameModeDescriptionPlayer}</p>
        </div>
      } else {
        description = 
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
          <div className="col-md-6">
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
              Create 
            </button>
            {description}
          </div>
         <div className="col-md-4 offset-1">
         <h3>Games</h3>
          <ul className="list-group">
          {gameList}
          </ul>
         </div>
        </div>
      );
    } 
    else {
      return (
        <div className="row">
          <div className="col-md-6">
            <h4 className="searchTitle">Searching for game</h4>
            <button
              className="btn btn-danger form-control searchbutton"
              onClick={this.stopSearch}
            >
              Stop searching
            </button>
            {description}
          </div>
          <div className="col-md-6 col-lg-6">
          <h3>Games</h3>
            <ul className="list-group">
            {gameList}
          </ul>
          <button className="btn btn-light previousList" onClick={this.previousList}>previous</button>
          <button className="btn btn-light nextList" onClick={this.nextList}>next</button>
         </div>
        </div>
      );
    }
  }
}

export default Search;
export { socket as Socket };
