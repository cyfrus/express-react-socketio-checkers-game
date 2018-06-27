import React from "react";


// class Game extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             board: [],
//             turn: "red",
//             pieceLocations: [64],
//             startingPositions: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23, 40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62]
//         }
//     }
//     componentDidMount() {
//         var board = [];
//         var cnt = 0;
//         var piece = false;
//         for (let index = 0; index < 8; index++) {
//             var row = [];
//             board.push(row);
//             for (let index2 = 0; index2 < 8; index2++) {
//                 this.state.startingPositions.find(function(element){
//                     return element === cnt;
//                 });
//                 var square = {
//                     piece: false,
//                     pieceColor: null,
//                 }
//                 board[index].push(square);
//                 cnt++;
//             }
//         }
//         this.setState({
//             board: board
//         })
//     }
//     render() {
//         console.log(this.state.board);
//         const board = this.state.board.map((row, index) =>
//         <div className="boardRow" key={index}>
//         {
//             row.map(function(square, i){
//                 return(
//                     <Square row={index} position={i} key={((index+1) * (i+1)).toString()}/>
//                 )          
//             })
//         }
//         </div>
//         );
//         return(
//             <div className="row">
//                 <div className="col-md-5 col-lg-5 boardColumn">
//                     <div className="board">
//                         {board}
//                     </div>
//                 </div>
//             </div>
//         )
//     };
// }

// class Square extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             color: ""
//         }
//     }
//     componentDidMount() {
//         var color = "";
//         if(this.props.row % 2 === 0 && this.props.position % 2 === 0) {
//             color = "white";
//         } else if ((this.props.row % 2 === 1 && this.props.position % 2 === 0) || (this.props.row % 2 === 0 && this.props.position % 2 === 1)){
//             color = "black";
//         } 
//         this.setState({
//             color: color
//         })
//     }
//     render() {
//         return (
//             <div className={this.state.color + " square"}></div>
//         );
//     }
// }

// class Piece extends React.Component {
//     constructor(props){
//         super(props);
//     }
//     render() {
//         return(
//             <div className="">         
//             </div>
//         )
//     }
// }

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardState: Array(8).fill(Array(8).fill(null))
        }
        this.handleClick = this.handleClick.bind(this);
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
    render() {
        var id = 0;
        const board = this.props.squares.map((row, index) => {
           return <div key={index} className="boardRow"> 
            {
                row.map((square) => {
                    var i = id++;
                    return <Square  id={i} key={id} className="square" onClick={() => this.props.onClick(i)}/>;
                })
            }
            </div>
        });
      return (
        <div className="board">
            {board}
        </div>
      );
    }
}

class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="square" onClick={this.props.onClick}>
            {this.props.id}
            </div>
        );
    }
}

export default Game;