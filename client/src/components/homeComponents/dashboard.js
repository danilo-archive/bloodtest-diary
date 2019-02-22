import React, { Component } from 'react';

import styled from "styled-components";
import OverduePatients from "./dashboardComponents/overduePatients";
import WeeklyCalendar from "./dashboardComponents/weeklyCalendar";
import OngoingWeekly from "./dashboardComponents/ongoingWeekly";
import Navbar from "./dashboardComponents/navbar";

import './dashboard.css';

class Dashboard extends Component {

  constructor(props){
      super(props);
      this.state = {
          mondayOfWeek: undefined,
          overdueTests: {},
          ongoingTests: {},
          calendar: {}
      };
      this.serverConnect = props.serverConnect;

      this.initDate();
      this.initOverduePanel();
      this.initWeeklyView();

  }

  initDate(){
      this.currentDay = new Date();
      this.state.mondayOfWeek = new Date();
      this.state.mondayOfWeek.setDate(this.state.mondayOfWeek.getDate() - this.currentDay.getDay() + 1);
  }


  initOverduePanel(){
      // TODO get from database
      this.state.overdueTests = this.serverConnect.TESTgetOverdueTests();
  }
  initWeeklyView(){
      let weekResponse = this.serverConnect.TESTgetTestsInWeek();
      this.state.ongoingTests = weekResponse[5];
      this.state.calendar = weekResponse.slice(0, 5);
  }

  initOngoingPanel(){
      // TODO get from database

  }


  render() {
    return (

      <div className={"dashboard"}>
        <div className={"overduePatients"}>
          <OverduePatients
            notificationNumber={
                this.state.overdueTests.length
            }
            anytimeAppointments={this.state.overdueTests}
          />
        </div>
        <div className={"calendar"}>
          <WeeklyCalendar
            calendar = {this.state.calendar}
            mondayDate = {this.state.mondayOfWeek}
          />
        </div>
        <div className={"test"}>
          <div className={"navbar"}>
            <Navbar />
          </div>
          <div className={"ongoingWeekly"}>
            <OngoingWeekly
              currentMonday = {this.currentMonday}
              notificationNumber={
                this.state.ongoingTests.length
              }
              anytimeAppointments={this.state.ongoingTests}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default Dashboard;
