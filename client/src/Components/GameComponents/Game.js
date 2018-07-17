import React from "react";
import Board from "./Board";

function setTheGame() {
    var boardState = [8];
        for(let i = 0; i < 8; i++) {
                boardState[i] = [];
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
            selected: {row: null, square: null},
            availableMoves: []
        }
        this.handleClick = this.handleClick.bind(this);
        this.checkJumps = this.checkJumps.bind(this);
    }
    
    availableMoves(row, square) {
        var moves = [];
        if(row === 0 && this.boardState[row][square].pieceColor === "red" && this.state.turn === "red") {
            return moves;
        }
        
        if(this.state.boardState[row][square].pieceColor === "red"){
             if(square !== 0 && !this.state.boardState[row-1][square-1].piece) {
                moves.push({row: row-1, square: square-1});
             }
             if(square !== 7 && !this.state.boardState[row-1][square+1].piece){
                moves.push({row: row-1, square: square+1});
             }
        }
        return this.checkJumps(moves, row);
    }

    checkJumps(availableMoves, row){
        var avMoves = availableMoves.slice();
        var nextRow = this.state.turn === "red" ? row - 1 : row + 1;
        if(row === 1 && this.state.turn === "red")
        return availableMoves;
        avMoves.slice(availableMoves.length-2, availableMoves.length).forEach(move => {
            if(this.state.turn === "red" && move.row >=2 && this.state.boardState[move.row-1][move.square-1].piece) {
                avMoves.push({row: move.row-2, square: move.square-1});
            }
            if(this.state.turn === "black" && move.row <= 6 && this.state.boardState[move.row-1][move.square-1].piece) {
                avMoves.push({row: move.row-2, square: move.square-2});
            }
        });
        return this.checkJumps(avMoves, nextRow);
    }

    handleClick(row, square) {
        var boardState = this.state.boardState.slice();
        var selected, availableMoves;
        if(this.state.selected.row && this.state.selected.square) {
            this.movePiece(row, square);
        }
        if(boardState[row][square].piece) {
            boardState[row][square].selected = true;
        }
        if(this.state.selected.row !== null && this.state.selected.square !== null) {
            boardState[this.state.selected.row][this.state.selected.square].selected = false;
        }
        if(this.state.selected.row === row && this.state.selected.square === square) {
            selected = {row: null, square: null};
        } else {
            selected = {row: row, square: square};
            availableMoves = this.availableMoves(selected.row, selected.square);
            console.log(availableMoves);
        }
        
       
        this.setState({
            boardState: boardState,
            selected: selected,
            availableMoves: availableMoves
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
            boardState[this.state.selected.row][this.state.selected.square].piece = false;
            boardState[this.state.selected.row][this.state.selected.square].pieceColor = "";
            this.setState({
                boardState: boardState
            })
        }
    }

    render() {
        console.log(this.state.boardState);
        return (
            <div className="row">
                <div className="game col-md-5">
                <Board squares={this.state.boardState} onClick={(row, square) => this.handleClick(row, square)} />
                </div>
            </div>
        );
    }
}

export default Game;