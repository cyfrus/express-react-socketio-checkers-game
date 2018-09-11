import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Redirect from "react-router-dom/Redirect";


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem('username'),
            email: sessionStorage.getItem('email'),
            about: sessionStorage.getItem('about'),
            MMR: sessionStorage.getItem('MMR'),
            edit: false
        }
        this.turnOnEdit = this.turnOnEdit.bind(this);
    }

    turnOnEdit() {
        this.setState({
            edit: true
        });
    }

    render() {
        if(this.state.edit) {
            return (<Redirect to={{pathname: '/edit'}} />);
        }
        return (
            <div className="row">
                <div className="profileDiv col-md-6 offset-md-3">
                <h3>PROFILE</h3>
                <div>
                    Username: {this.state.username}
                </div>
                <div>
                    E-mail: {this.state.email}
                </div>
                <div>
                    MMR: {this.state.MMR}
                </div>
                <div>
                    About: {this.state.about}
                </div>
                <div>
                    Single Player matches: {this.state.spMatches}
                </div>
                <div>
                    Single Player matches won: {this.state.spMatchesWon}
                </div>
                <div>
                    Multiplayer matches: {this.state.mpMatches}
                </div>
                <div>
                    Multiplayer matches won: {this.state.mpMatchesWon}
                </div>
                <button className="btn btn-danger" onClick={this.turnOnEdit}>Edit your information</button>
                </div>
            </div>
        );
    }
}

export default Profile;