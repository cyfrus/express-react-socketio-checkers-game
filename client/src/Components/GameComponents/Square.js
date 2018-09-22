import React from 'react';

class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var selected = this.props.selected === true ? "selected" : "";
        if(this.props.piece) {
           return(
            <div className={"d-flex align-items-center square " + this.props.color + " " + selected} onClick={this.props.onClick}>
            <Player color={this.props.pieceColor} />
            </div>
        );    
        } else {
            return (
            <div className={"d-flex align-items-center square " + this.props.color + "" + selected} onClick={this.props.onClick}>
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

export default Square;