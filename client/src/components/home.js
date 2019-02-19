import React, { Component } from 'react';
import Header from './header.js';
import Dashboard from './homeComponents/dashboard.js';
import './home.css';

class Home extends Component {
  render() {
    return (
      <div className={"home"}>
        <Header />

        <Dashboard />
      </div>
    );
  }
}

export default Home;
