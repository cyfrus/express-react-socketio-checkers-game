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
    }
    
    availableMoves() {
        this.state.boardState.forEach((row) => {
            row.forEach( square => {
                if(this.boardState[this.state.selected.row][this.state.selected.square].piece){

                }
            })
        })
    }

    handleClick(row, square) {
        var boardState = this.state.boardState.slice();
        var selected;
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
        }
        
        
        this.setState({
            boardState: boardState,
            selected: selected
        })
        console.log(`${row}, ${square}`);
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