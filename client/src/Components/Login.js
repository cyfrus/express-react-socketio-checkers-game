import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";

export var authenticated = false;

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      redirectToReferrer: false,
      authenticated: false,
      test: false
    };
  }

  handleSubmit(event) {
    var data = {
      username: this.state.username,
      password: this.state.password
    };

    axios.post('/authenticate', data)
    .then(function (response) {
      authenticated = response.data.auth;
      this.setState({
        authenticated : response.data.auth
      })
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  render() {
    if (this.state.authenticated) {
      return (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-5">
          <h3 className="loginTitle">Login</h3>
          <div>
            <div className="form-group">
              {" "}
              Username{" "}
              <input
                type="text"
                className="username form-control"
                name="username"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              {" "}
              Password{" "}
              <input
                type="password"
                className="username form-control"
                name="password"
                onChange={this.handleInputChange}
              />
            </div>
            <input
              type="button"
              value="Log In"
              className="btn btn-dark form-control loginButton"
              onClick={this.handleSubmit}
            />
          <a className="registrationLink" href="/registration">Registration</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
