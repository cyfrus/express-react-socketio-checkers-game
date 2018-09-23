import React from "react";
import Board from "./Board";
import io from "socket.io-client";
import {Socket} from "../Search";
import axios from "axios";
import {Redirect} from "react-router-dom";

var socket  = Socket;

function setTheGame() {
    var boardState = [8];
        for(let i = 0; i < 8; i++) {
                boardState[i] = [8];
           for(let z = 0; z < 8; z++){  
               if(((i === 0 || i === 2 || i === 6) && (z % 2)) || ((i === 1 || i === 5 || i === 7) && !(z % 2)))
               {    
                    if(i === 2 || i === 0 || i === 1)
                    boardState[i][z] = {piece: true, pieceColor: "black"};
                    else
                    boardState[i][z] = {piece: true, pieceColor: "red"}
               } else {
                    boardState[i][z] = {piece: false, pieceColor: ""};
               }
               
           }
        }
        return boardState;
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardState: setTheGame(),
            turn: "",
            redPieces: 12,
            blackPieces: 12,
            selected: false,
            selectedLocation: {row: false, square: false},
            removedPieces: [],
            gameOver: false,
            player1: '',
            player2: '',
            red: '',
            black: '',
            myTurn: false,
            color: "",
            match_id: null,
            roomID: '',
            redirect: false,
            winner: "",
            messages: [],
            currentMessage: { text: ""}
        }
        this.handleClick = this.handleClick.bind(this);
        this.setMsg = this.setMsg.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }
 
    checkIfmyTurn(gameInfo) { 
        if((gameInfo.TURN === "player1" && gameInfo.PLAYER1ID === parseInt(sessionStorage.getItem('id'))) || (gameInfo.TURN === "player2" && gameInfo.PLAYER2ID === parseInt(sessionStorage.getItem('id')))) {
            return true;
        }
        return false;
    }

    getColor(gameInfo) {
        if (parseInt(sessionStorage.getItem('id'), 10) === gameInfo.PLAYER1ID && gameInfo.BLACK === "player1") {
            return "black";
        } else if (parseInt(sessionStorage.getItem('id'), 10) === gameInfo.PLAYER1ID && gameInfo.RED === "player1") {
            return "red";
        } else if (parseInt(sessionStorage.getItem('id'), 10) === gameInfo.PLAYER2ID && gameInfo.RED === "player2") {
            return "red";
        } else if(parseInt(sessionStorage.getItem('id'), 10) === gameInfo.PLAYER2ID && gameInfo.BLACK === "player2") {
            return "black";
        }

    }
    
    componentDidMount() {
        axios.post('/getMatchData', {
            user_id: parseInt(sessionStorage.getItem('id')),
            match_id: parseInt(sessionStorage.getItem('match_id'))
          })
          .then(function (response) {
            if(response.data === "") {
                console.log(response);
                this.setState({
                    // redirect: true
                },() => {
                    console.log( "redirect je " + this.state.redirect);
                });
            } else {
                console.log(response);
                this.setState({
                    player1: response.data.PLAYER1,
                    player2: response.data.PLAYER2,
                    turn: response.data.TURN,
                    myTurn : this.checkIfmyTurn(response.data),
                    color: this.getColor(response.data),
                    match_id: response.data.MATCH_ID,
                    red: response.data.RED,
                    black: response.data.BLACK,
                    roomID: response.data.ROOM_ID,
                    boardState: response.data.MOVES,
                    messages: response.data.MESSAGES
                    
                }, () => {
                    console.log(this.state);
                    socket.emit('checkIfUserIsInTheRoom', this.state.roomID); 
                    
                });
            } 
          }.bind(this))
          .catch(function (error) {
            console.log(error);
          });

        socket.on('updateBoardState', (data) => {
            this.setState({
                player1: data.PLAYER1,
                player2: data.PLAYER2,
                turn: data.TURN,
                myTurn : this.checkIfmyTurn(data),
                color: this.getColor(data),
                match_id: data.MATCH_ID,
                red: data.RED,
                black: data.BLACK,
                roomID: data.ROOM_ID,
                boardState: data.MOVES,
                messages: [],
                winner: data.WINNER,
                gameOver: data.GAMEOVER,
                messages: data.MESSAGES.messages
            });
            console.log(data);
        });
        socket.on('checkMoveResponse', (data) => {
            console.log("checkMoveResponse!");
        });
        socket.on('message', (data) => {
            console.log("new message !");
            this.setState({
                messages: data.messages
            })
        });
        socket.on('reconnected', (data) => {
            console.log(data);
        });
        
    }
    
    handleClick(row, square) {
       
        if(!this.state.gameOver && this.state.myTurn) {
            let boardState = this.state.boardState.slice();
            if(boardState[row][square].pieceColor === this.state.color) {
                boardState[row][square].selected = true;
                if(this.state.selectedLocation.row && this.state.selectedLocation.square) {
                    boardState[this.state.selectedLocation.row][this.state.selectedLocation.square].selected = false;
                }

                this.setState({
                    boardState,
                    selectedLocation: {row, square},
                    selected: true  
                }, () => {
                    console.log("Selected je " + this.state.selected);
                });
            } else if(this.state.selected && !boardState[row][square].piece) {
                socket.emit('checkMove', {
                    roomID: this.state.roomID,
                    user_id: parseInt(sessionStorage.getItem('id')),
                    move: {row, square},
                    from: {row: this.state.selectedLocation.row, square: this.state.selectedLocation.square },
                    color: this.state.color,
                    match_id: this.state.match_id
                });
                this.setState({
                    selected: false
                });
            }
            else {
                if(this.state.selectedLocation.row && this.state.selectedLocation.square ) {
                    boardState[this.state.selectedLocation.row][this.state.selectedLocation.square].selected = false;
                }
                this.setState({
                    boardState,
                    selected: false
                });
            }
        }
    }
    sendMessage() {
        let message = this.state.currentMessage;
        socket.emit('sendMessage', message);
        this.setState({
            currentMessage: { text: ""}
        });
    }
    setMsg(event) {
        let message = {
            sender: sessionStorage.getItem('username'),
            text: event.target.value,
            match_id: this.state.match_id,
            roomID: this.state.roomID
        };
        
        this.setState({
            currentMessage: message
        });
    }
    handleEnter(e) {
        if (e.key === 'Enter') {
            this.sendMessage();
          }
    }
    render() {
        let gameOver, messages;
        if(this.state.messages && this.state.messages.length){
            messages = this.state.messages.map((message, index) => {
                return <li className="list-group-item" key={index}><strong>{message.sender} : </strong>{message.text}</li>
            });
        }
        if(this.state.gameOver) {
            gameOver = (<div className={"winner + winnerBox" + this.state.winner}>WINNER: {this.state.winner}</div>);
        }
        if(this.state.redirect) {
            return (<Redirect
          to={{
            pathname: "/"
          }}
        />);
        }
        else {
            let player1Color = this.state.red === "player1" ? "red" : "black",
            player2Color = this.state.black === "player2" ? "black" : "red",
            playersInfo = (
            <div className="playersInfo">
                <div><div className="playerUsernameDiv">Player 1 : {this.state.player1}</div><div className={player1Color + " playerColor"}></div></div>
                <div><div className="playerUsernameDiv">Player 2 : {this.state.player2}</div><div className={player2Color + " playerColor"}></div></div>
                
            </div>
            
        );
        return (
            <div className="row">
                <div className="col-8 game">
                <h3>Turn: {this.state.turn}</h3>
                {playersInfo}
                {gameOver}
                <Board squares={this.state.boardState} onClick={(row, square) => this.handleClick(row, square)} />
                </div>
                <div className="col-lg-4 col-md-12 mainMsgDiv">
                <div className="messages">
                <h4>Messages</h4>
                    <div className="messageContainer">
                        <ul className="list-group list-group-flush">
                            {messages}
                        </ul>
                    </div>
                </div>
                    
                    <input className="sendMsgInput form-control" placeholder="send message" onKeyDown={this.handleEnter} value={this.state.currentMessage.text} onChange={this.setMsg} />
                    <button className="btn btn-light form-control sendMsg" onClick={this.sendMessage} name="message">Send</button>
                </div>
            </div>
        );
        }
    }
}

export default Game;