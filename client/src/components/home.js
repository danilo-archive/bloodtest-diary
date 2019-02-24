import CalendarDay from "./calendar/CalendarDay";
import React, { Component } from 'react';
import Header from './header.js';
import Dashboard from './homeComponents/dashboard.js';
import './home.css';

class Home extends Component {
  render() {
    return (
      <div className={"home"}>
        <Header />
        <h1>Hello</h1>
        <Dashboard />
      </div>
    );
  }
}

export default Home;
