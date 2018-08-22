import React from "react";
import Board from "./Board";
import io from "socket.io-client";
import {Socket} from "../Search";

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
            turn: "red",
            redPieces: 12,
            whitePieces: 12,
            selected: false,
            selectedLocation: {row: false, square: false},
            availableMoves: []
        }
        this.handleClick = this.handleClick.bind(this);
        this.checkJumps = this.checkJumps.bind(this);
        this.movePiece = this.movePiece.bind(this);
    }

    componentDidMount() {
        socket.on("changeTurn", (data) => {
          this.setState({
              turn: data.turn
          });
        });
    }
    
    availableMoves(row, square) {
        var moves = [];
        if(row === 0 && this.boardState[row][square].pieceColor === "red" && this.state.turn === "red") {
            return moves;
        }
        
        if(this.state.boardState[row][square].pieceColor === "red" && this.state.turn === "red"){
             if(square !== 0 && !this.state.boardState[row-1][square-1].piece) {
                moves.push({row: row-1, square: square-1, remove: []});
             }
             if(square !== 7 && !this.state.boardState[row-1][square+1].piece){
                moves.push({row: row-1, square: square+1, remove: []});
             }
        } else if(this.state.boardState[row][square].pieceColor === "black" && this.state.turn === "black") {
            if(square !== 7 && !this.state.boardState[row+1][square+1].piece) {
                moves.push({row: row+1, square: square+1, remove: []});
             }
             if(square !== 0 && !this.state.boardState[row+1][square-1].piece){
                moves.push({row: row+1, square: square-1, remove: []});
             }
        }
        return moves;
    }

    checkJumps(jumps, row, square){
           
    }

    unableToJump(row, square) {
        if((row >= 6 && square >= 6 && square <= 1 && this.state.turn === "red") || (row <= 1 && square >= 6 && square <= 1 && this.state.turn === "black")) {
            return true;
        }
        return false;
    }

    handleClick(row, square) {
        console.log(`Selektirani row je ${row} square ${square}`);
        var boardState = this.state.boardState.slice();
        var selectedLocation, selected, availableMoves;
        if(this.state.selected) {
            if(this.movePiece(row, square)) {
                boardState = this.movePiece(row, square);
                socket.emit('move');
            }
            boardState[this.state.selectedLocation.row][this.state.selectedLocation.square].selected = false;
            selectedLocation = {row: false, square: false};
            selected = false;
        } else if(boardState[row][square].piece) {
            selectedLocation = {row: row, square: square};
            boardState[row][square].selected = true;
            selected = true;
            availableMoves = this.availableMoves(row, square);
            console.log(availableMoves);
        }
       
        this.setState({
            boardState: boardState,
            selectedLocation: selectedLocation,
            availableMoves: availableMoves,
            selected: selected
        })
        
        console.log(`${row}, ${square}`);
    }
    
    movePiece(row, square) {
        var boardState = this.state.boardState.slice();
        var validMove = this.state.availableMoves.find(move => {
            return move.row === row && move.square === square;
        });

        if(validMove) {
            boardState[row][square].piece = true;
            boardState[row][square].pieceColor = this.state.turn;
            boardState[this.state.selectedLocation.row][this.state.selectedLocation.square].piece = false;
            boardState[this.state.selectedLocation.row][this.state.selectedLocation.square].pieceColor = "";
            return boardState;
        }
       return false;
    }

    render() {
        console.log(this.state.boardState);
        return (
            <div className="row">
                <div className="game col-md-5">
                <h3>Turn: {this.state.turn}</h3>
                <Board squares={this.state.boardState} onClick={(row, square) => this.handleClick(row, square)} />
                </div>
            </div>
        );
    }
}

export default Game;