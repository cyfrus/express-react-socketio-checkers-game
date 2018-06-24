import React from "react";


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            turn: "red",
        }
    }
    componentDidMount() {
        var board = [];
        for (let index = 0; index < 8; index++) {
            var row = [];
            board.push(row);
            for (let index2 = 0; index2 < 8; index2++) {
                var element = <Piece />;
                board[index].push(element);
            }
        }
        this.setState({
            board: board
        })
    }
    render() {
        console.log(this.state.board);
        const board = this.state.board.map((row, index) =>
        <div className="boardRow" key={index}>
        {
            row.map(function(square, i){
                return(
                    <div className="square" key={i}></div>
                )  
            })
        }
        </div>
        );
        return(
            <div className="row">
                <div className="col-md-5 col-lg-5 boardColumn">
                    <div className="board">
                        {board}
                    </div>
                </div>
            </div>
        )
    };
}

class Piece extends React.Component {
    render() {
        return(
            <div>
                
            </div>
        )
    }
}


export default Game;