import React from "react";
import {
  Redirect
} from "react-router-dom";
import axios from "axios";

class Registration extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifyErrors = this.verifyErrors.bind(this);
    this.state = {
      success: false,
      errors: {
        notMatchingPasswords: "",
        notMatchingPasswordsMessage: "",
        passwordLength: "",
        passwordLengthMessage: ""
      }
    };
  }

  verifyErrors() {
    let errors = this.state.errors;
    if (this.state.password && this.state.password !== this.state.repassword) {
      errors.notMatchingPasswordsMessage = "Passwords do not match";
    } else {
      errors.notMatchingPasswordsMessage = "";
    }
    if (this.state.password && this.state.password.length < 6) {
      errors.passwordLengthMessage = "Password needs to be 6 characters length";
    } else {
      errors.passwordLengthMessage = "";
    }
    if(this.state.repassword && this.state.repassword.length < 6) {
      errors.repasswordLengthMessage = "Password needs to be 6 characters length";
    } else {
      errors.repasswordLengthMessage = "";
    }
    this.setState({
      errors: errors
    });
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      console.log(this.state);
      this.verifyErrors();
    });
  }
  handleSubmit(e) {
    
      axios
        .post("/register", {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          about: this.state.about.slice(0, 200)
        })
        .then(response => {
          console.log(response);
          this.setState({
            message: response.data.message,
            success: response.data.success
          });
        })
        .catch(error => {
          console.log(error);
        });
    
  }

  render() {
    if (!this.state.success) {
      return (
        <div id="registration" className="col-md-5">
          <h3 className="registrationTitle">Registration</h3>
          <div>
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                className="form-control usernameInput"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control emailInput"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="form-control passwordInput"
                onChange={this.handleInputChange}
              />
              <div className="errorMessage">
                {this.state.errors.passwordLengthMessage}
              </div>
              <div className="errorMessage">
                {this.state.errors.notMatchingPasswordsMessage}
              </div>
            </div>
            <div className="form-group">
              <label>Re-type password</label>
              <input
                name="repassword"
                type="password"
                className="form-control repassword"
                onChange={this.handleInputChange}
              />
              <div className="errorMessage">
                {this.state.errors.repasswordLengthMessage}
              </div>
              <div className="errorMessage">
                {this.state.errors.notMatchingPasswordsMessage}
              </div>
            </div>
            <div className="form-group">
              <label>Write something about yourself</label>
              <textarea name="about" max="255" className="form-control" onChange={this.handleInputChange}></textarea>
            </div>
            <p className="registrationParagraph">All fields are required !</p>
            <div className="message">{this.state.message}</div>
            <input
              type="submit"
              value="Submit"
              className="btn btn-dark form-control registrationButton"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-md-12">
          <p>{this.state.message}</p>
            <a href="/login" className="loginLink">Login</a> 
          </div>
        </div>
      );
    }
  }
}

export default Registration;
