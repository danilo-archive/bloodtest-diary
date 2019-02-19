import React, { Component } from 'react';

import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (

      <div className={"dashboard"}>
        <div className={"overduePatients"}>
        </div>
        <div className={"calender"}>
        </div>
        <div className={"ongoingWeekly"}>

        </div>
        <div className={"footer"}>
        </div>
      </div>
    );
  }
}

export default Dashboard;
