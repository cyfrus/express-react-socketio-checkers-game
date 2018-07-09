import React from 'react';
import Square from './Square';

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
        const board = this.props.squares.map((row, rowIndex) => {
            return <div key={rowIndex} className="boardRow">
                {
                    row.map((square, squareIndex) => {
                        var i = id++;
                         return <Square color={this.determineColor(rowIndex, squareIndex)} id={i} key={id} className="square" piece={square.piece} selected={square.selected} pieceColor={square.pieceColor} onClick={() => this.props.onClick(rowIndex, squareIndex)} />;
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

export default Board;