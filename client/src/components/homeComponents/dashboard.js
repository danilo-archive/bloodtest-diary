import React, { Component } from 'react';

import styled from "styled-components";
import OverduePatients from "./dashboardComponents/overduePatients";
import WeeklyCalendar from "./dashboardComponents/weeklyCalendar";
import OngoingWeekly from "./dashboardComponents/ongoingWeekly";
import Navbar from "./dashboardComponents/navbar";
import arrow from "../../images/arrow.png";

import './dashboard.css';

// TODO remove forceUpdates and use setState instead
class Dashboard extends Component {

  constructor(props){
      super(props);
      this.state = {
          dashboardReady: false,
          overdueReady: false,
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
      //console.log(this.state.calendar);
      this.serverConnect.setOnTestStatusChange((id, status) => {
          // check if it's overdue
          for (var i = 0; i < this.state.overdueTests.length; ++i){
              var test = this.state.overdueTests[i];
              if (test.test_id === id){
                  var newState = this.state;
                  newState.overdueTests[i].completed_status = status;
                  this.setState(newState);
                  return;
              }
          }
          // check if it's ongoing
          for (var i = 0; i < this.state.ongoingTests.length; ++i){
              var test = this.state.ongoingTests[i];
              if (test.test_id === id){
                  var newState = this.state;
                  newState.ongoingTests[i].completed_status = status;
                  this.setState(newState);
                  console.log(this.state.ongoingTests);
                  return;
              }
          }
          //check if it's in the current calendar
          for (var i = 0 ; i < this.state.calendar.length; ++i){
              var day = this.state.calendar[i];
              for(var j = 0; j < day.length; ++j){
                  var test = day[j];
                  if (test.test_id === id){
                      var newState = this.state;
                      newState.calendar[i][j].completed_status = status;
                      //test.status = status;
                      //this.forceUpdate();
                      this.setState(newState);
                      console.log(this.state.calendar);
                      console.log("changed");
                      return;
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
      //this.state.overdueTests = this.serverConnect.TESTgetOverdueTests();
      this.serverConnect.getOverdueTests( res => {
          console.log("overdue init");
          this.state.overdueTests = res;
          this.state.overdueReady = true;
          this.forceUpdate();
      });

  }

  updateDashboard(){
      this.serverConnect.getTestsInWeek(this.state.weekDays[0], res => {
          console.log(res);
          this.state.ongoingTests = res[5];
          this.state.calendar = res.slice(0, 5);
          this.state.dashboardReady = true;
          this.forceUpdate();
      });
  }

  initWeeklyView(){
      //let weekResponse = this.serverConnect.TESTgetTestsInWeek();
      //this.state.ongoingTests = weekResponse[5];
      //this.state.calendar = weekResponse.slice(0, 5);
      this.serverConnect.getTestsInWeek(this.state.weekDays[0], res => {
          this.state.ongoingTests = res[5];
          this.state.calendar = res.slice(0, 5);
          this.state.dashboardReady = true;
          this.forceUpdate();
      });

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
      //this.state.calendar = this.serverConnect.TESTgetEmptyWeek();
      //this.state.ongoingTests = this.serverConnect.TESTgetEmptyWeek()[5];
      this.updateDashboard();
      this.forceUpdate();
  }
  handlePrevious(event){
      this.state.weekDays[0].setDate(this.state.weekDays[0].getDate() - 7);
      this.state.weekDays[1].setDate(this.state.weekDays[1].getDate() - 7);
      this.state.weekDays[2].setDate(this.state.weekDays[2].getDate() - 7);
      this.state.weekDays[3].setDate(this.state.weekDays[3].getDate() - 7);
      this.state.weekDays[4].setDate(this.state.weekDays[4].getDate() - 7);
      // TODO get data from db
     // this.state.calendar = this.serverConnect.TESTgetEmptyWeek();
      //this.state.ongoingTests = [];
      this.updateDashboard();
      this.forceUpdate();
  }
  // TODO remove
  testReact(event){
      this.serverConnect.changeStatus(1, "late");
  }


  render() {
    if (this.state.dashboardReady && this.state.overdueReady){
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
              <Navbar
                  onPrev = {this.handlePrevious}
                  onNext = {this.handleNext}
              />
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
   }else{
       // TODO loading screen.
       return ("");
   }
 }
}


export default Dashboard;
