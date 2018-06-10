import React, { Component } from 'react';
// import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navigation from './Navigation';



class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App container-fluid">
      <Navigation />
      </div>
    );
  }
}

export default App;
