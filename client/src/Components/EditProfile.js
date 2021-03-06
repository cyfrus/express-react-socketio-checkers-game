import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";


class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem('username'),
            email: sessionStorage.getItem('email'),
            about: sessionStorage.getItem('about'),
            password: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        var data = {
            username: this.state.username,
            email: this.state.email,
            about: this.state.about,
            password: this.state.password
        }   

        axios.post('/edit', data)
        .then(function (response) {
        console.log(response);
            this.setState({
            authenticated : response.data.auth,
            error: response.data.auth ? "" : "Incorrect username or password!"
            });
        }.bind(this))
        .catch(function (error) {
        console.log(error);
        });
    }

    render() {
        return(
            <div className="row">
                <div className="col-md-6 offset-md-3">
                <h3>Edit your Profile</h3>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" value={this.state.username}/>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={this.state.email} />
                </div>
                <div className="form-group">
                    <label>About</label>
                    <textarea name="about" className="form-control" value={this.state.about}></textarea>
                </div>
                <div className="form-group">
                    <label>Change Password</label>
                    <input type="password" name="changedPassword" className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Current password</label>
                    <input type="password" name="password" className="form-control"/>
                </div>
                <button className="btn btn-danger">Submit</button>
                </div>
            </div>
        );
    }
}

export default EditProfile;