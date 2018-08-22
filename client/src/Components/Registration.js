import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Registration extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {};
  }
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
        console.log(this.state);
    });
    
  }
  handleSubmit(e) {
    if(Object.keys(this.state).length) {
        axios.post('/register', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }

  render() {
    return (
      <div id="registration" className="col-md-5">
        <h3 className="registrationTitle">Registration</h3>
        <div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" className="form-control" onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" className="form-control" onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control" onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Re-type password</label>
            <input name="repassword" type="password" className="form-control" onChange={this.handleInputChange} />
          </div>
          <p className="registrationParagraph">All fields are required !</p>
          <input
            type="submit"
            value="Submit"
            className="btn btn-dark form-control registrationButton"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

export default Registration;
