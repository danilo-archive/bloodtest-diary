import React, { Component } from 'react';

import styled from "styled-components";
import OverduePatients from "./dashboardComponents/overduePatients";
import WeeklyCalendar from "./dashboardComponents/weeklyCalendar";
import OngoingWeekly from "./dashboardComponents/ongoingWeekly";
import Navbar from "./dashboardComponents/navbar";
import arrow from "../../images/arrow.png";

import './dashboard.css';

class Dashboard extends Component {

  constructor(props){
      super(props);
      this.state = {
          weekDays: [undefined, undefined, undefined, undefined, undefined],
          overdueTests: {},
          ongoingTests: {},
          calendar: {}
      };
      this.serverConnect = props.serverConnect;

      this.initDays();
      this.initOverduePanel();
      this.initWeeklyView();
      this.initCallbacks();

      this.handleNext = this.handleNext.bind(this);
      this.handlePrevious = this.handlePrevious.bind(this);
  }

  initCallbacks(){
      console.log(this.state.calendar);
      this.serverConnect.setOnTestStatusChange((id, status) => {
          for (var i = 0 ; i < this.state.calendar.length; ++i){
              var day = this.state.calendar[i];
              for(var j = 0; j < day.length; ++j){
                  var test = day[j];
                  if (test.id === id){
                      var newState = this.state;
                      newState.calendar[i][j].status = status;
                      //test.status = status;
                      //this.forceUpdate();
                      this.setState(newState);
                      console.log(this.state.calendar);
                      console.log("changed");
                  }
              }
          }
      });
  }

  initDays(){
      this.state.weekDays[0] = new Date();
      this.state.weekDays[0].setDate(this.state.weekDays[0].getDate() - this.state.weekDays[0].getDay() + 1);
      this.initWeekDays();
   }

   initWeekDays(){
       let mondayDate = this.state.weekDays[0];
       let tuesdayDate = new Date();
       tuesdayDate.setDate(mondayDate.getDate() + 1);
       let wednesdayDate = new Date();
       wednesdayDate.setDate(mondayDate.getDate() + 2);
       let thursdayDate = new Date();
       thursdayDate.setDate(mondayDate.getDate() + 3);
       let fridayDate = new Date();
       fridayDate.setDate(mondayDate.getDate() + 4);

       this.state.weekDays[1] = tuesdayDate;
       this.state.weekDays[2] = wednesdayDate;
       this.state.weekDays[3] = thursdayDate;
       this.state.weekDays[4] = fridayDate;
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

  handleNext(event){
      this.state.weekDays[0].setDate(this.state.weekDays[0].getDate() + 7);
      this.state.weekDays[1].setDate(this.state.weekDays[1].getDate() + 7);
      this.state.weekDays[2].setDate(this.state.weekDays[2].getDate() + 7);
      this.state.weekDays[3].setDate(this.state.weekDays[3].getDate() + 7);
      this.state.weekDays[4].setDate(this.state.weekDays[4].getDate() + 7);
      // TODO get data from db
      this.state.calendar = this.serverConnect.TESTgetEmptyWeek();
      this.state.ongoingTests = this.serverConnect.TESTgetEmptyWeek()[5];
      this.forceUpdate();
  }
  handlePrevious(event){
      this.state.weekDays[0].setDate(this.state.weekDays[0].getDate() - 7);
      this.state.weekDays[1].setDate(this.state.weekDays[1].getDate() - 7);
      this.state.weekDays[2].setDate(this.state.weekDays[2].getDate() - 7);
      this.state.weekDays[3].setDate(this.state.weekDays[3].getDate() - 7);
      this.state.weekDays[4].setDate(this.state.weekDays[4].getDate() - 7);
      // TODO get data from db
      this.state.calendar = this.serverConnect.TESTgetEmptyWeek();
      this.state.ongoingTests = [];
      this.forceUpdate();
  }
  // TODO remove
  testReact(event){
      this.serverConnect.changeStatus(1, "late");
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
        <div className={"rightSideDash"}>
          <div className={"navbar"}>
            <Navbar />
          </div>
          <div className={"bottomSideDash"}>
            <div className={"calendar"}>
              <WeeklyCalendar
                calendar = {this.state.calendar}
                weekDays = {this.state.weekDays}
              />
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

      </div>

    );
  }

    oldRender() {
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
          <div className={"scrollButtons"}>
              <img src={arrow} className={"prevButton"} onClick={this.handlePrevious} alt={"Previous Date"}/>
              <img src={arrow} className={"nextButton"} onClick={this.handleNext} alt={"Next Date"}/>
          </div>
          <div className={"calendar"}>
            <WeeklyCalendar
              calendar = {this.state.calendar}
              weekDays = {this.state.weekDays}
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
