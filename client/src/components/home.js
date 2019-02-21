import CalendarDay from "./homeComponents/dashboardComponents/calendarComponents/CalendarDay";
import React, { Component } from 'react';
import Header from './header.js';
import Dashboard from './homeComponents/dashboard.js';
import './home.css';
import {getServerConnect} from "../serverConnection.js";

class Home extends Component {

  constructor(props){
      super(props);
      this.serverConnect = getServerConnect();
      this.serverConnect.joinMainPage();
  }

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
