import CalendarDay from "./homeComponents/dashboardComponents/calendarComponents/CalendarDay";
import React, { Component } from 'react';

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
        <Dashboard serverConnect={this.serverConnect}/>
      </div>
    );
  }
}

export default Home;
