import React from "react";

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardState: [],
            turn: "red",
            redPieces: 12,
            whitePieces: 12
        }
        this.handleClick = this.handleClick.bind(this);
    }
    
    componentDidMount() {
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
        // var startingPositions = [[1, 3, 5, 7], [0, 2, 4, 6], [] , [], [], [], [], []];
        // startingPositions.forEach((row, index) => {
        //     row.forEach((pieceLocation) => {
        //         boardState[index][pieceLocation].piece = true;
        //     })
        // });
        this.setState({
            boardState: boardState
        })
    }

    handleClick(i) {
        console.log(i);
    }
    
    render() {
        console.log(this.state.boardState);
        return (
            <div className="row">
                <div className="game col-md-5">
                <Board squares={this.state.boardState} onClick={(i) => this.handleClick(i)} />
                </div>
            </div>
        );
    }
}

class Board extends React.Component {
    determineColor(row, place) {
        if((row % 2  && place % 2 === 0) || (row % 2 === 0 && place % 2)) {
            return "black";
        } else {
            return "white";
        }
    }
    renderBoard() {
        var id = 0;
        const board = this.props.squares.map((row, index) => {
            return <div key={index} className="boardRow">
                {
                    row.map((square, place) => {
                        var i = id++;
                         return <Square color={this.determineColor(index, place)} id={i} key={id} className="square" piece={square.piece} pieceColor={square.pieceColor} onClick={() => this.props.onClick(i)} />;
                    })
                }
            </div>
        });
        return board;
    }
    render() {
      return (
        <div className="board">
            {this.renderBoard()}
        </div>
      );
    }
}

class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.piece) {
           return(
            <div className={"d-flex align-items-center square " + this.props.color} onClick={this.props.onClick}>
            <Player color={this.props.pieceColor} />
            </div>
        );    
        } else {
            return (
            <div className={"d-flex align-items-center square " + this.props.color} onClick={this.props.onClick}>
            </div>
            );
        }
        
    }
}

function Player(props) {
    return(
        <div className={" player" + props.color}>
        </div>
    );
}

export default Game;