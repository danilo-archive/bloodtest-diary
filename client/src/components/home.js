import React, { Component } from 'react';
import styled from "styled-components";
import Modal from 'react-responsive-modal';


import Header from './header.js';

import Navbar from "./homeComponents/navbar";
import OverduePatients from "./homeComponents/overduePatients";
import WeeklyCalendar from "./homeComponents/weeklyCalendar";
import OngoingWeekly from "./homeComponents/ongoingWeekly";
import arrow from "../images/arrow.png";
import AddTest from "./homeComponents/addTest/AddTestView";


import {getServerConnect} from "../serverConnection.js";

import './home.css';

class Home extends Component {

    constructor(props) {
      super(props);
      this.serverConnect = getServerConnect();
      this.serverConnect.joinMainPage();

      this.state = {
        dashboardReady: false,
        overdueReady: false,
        weekDays: [undefined, undefined, undefined, undefined, undefined],
        overdueTests: {},
        ongoingTests: {},
        calendar: {},
        openModal: false
      };

      this.initDays();
      this.initOverduePanel();
      this.updateDashboard();
      this.initCallbacks();

      this.handleNext = this.handleNext.bind(this);
      this.handlePrevious = this.handlePrevious.bind(this);

      this.onOpenModal = this.onOpenModal.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);
    }

    initCallbacks() {
      this.initOnTestAdded();
      this.initOnTestStatusChange();
    }

    initOnTestAdded() {
      this.serverConnect.setOnTestAdded(newTest => {
        // TODO change db response
        /*let dueDate = newTest.first_due_date;
           for (let i = 0; i < this.state.weekDays.length; ++i){
               if (dueDate === this.state.weekDays[i]){
                   this.state.calendar[i].push(newTest);
                   this.forceUpdate();
                   return;
               }
           }*/
        this.updateDashboard();
      });
    }

    initOnTestStatusChange() {
      this.serverConnect.setOnTestStatusChange((id, status) => {
        // check if it's overdue
        for (var i = 0; i < this.state.overdueTests.length; ++i) {
          var test = this.state.overdueTests[i];
          if (test.test_id === id) {
            let newOverdueTests = [...this.state.overdueTests];
            newOverdueTests[i].completed_status = status;
            this.setState({overdueTests: newOverdueTests});
            return;
          }
        }
        // check if it's ongoing
        for (var i = 0; i < this.state.ongoingTests.length; ++i) {
          var test = this.state.ongoingTests[i];
          if (test.test_id === id) {
            let newOngoingTests = [...this.state.ongoingTests];
            newOngoingTests[i].completed_status = status;
            this.setState({ongoingTests: newOngoingTests});
            return;
          }
        }
        //check if it's in the current calendar
        for (var i = 0; i < this.state.calendar.length; ++i) {
          var day = this.state.calendar[i];
          for (var j = 0; j < day.length; ++j) {
            var test = day[j];
            if (test.test_id === id) {
              let newCalendar = [...this.state.calendar];
              newCalendar[i][j].completed_status = status;
              this.setState({calendar: newCalendar});
              return;
            }
          }
        }
      });
    }

    initDays() {
      this.state.weekDays[0] = new Date();
      this.state.weekDays[0].setDate(
        this.state.weekDays[0].getDate() - this.state.weekDays[0].getDay() + 1
      );
      this.initWeekDays();
    }

    initWeekDays() {
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

    initOverduePanel() {
      // TODO get from database
      //this.state.overdueTests = this.serverConnect.TESTgetOverdueTests();
      this.serverConnect.getOverdueTests(res => {
        console.log("overdue init");
        this.state.overdueTests = res;
        this.state.overdueReady = true;
        this.forceUpdate();
      });
    }

    updateDashboard() {
      this.serverConnect.getTestsInWeek(this.state.weekDays[0], res => {
        this.setState({
          ongoingTests: res[5],
          calendar: res.slice(0, 5),
          dashboardReady: true
        });
      });
    }

    initOngoingPanel() {
      // TODO get from database
    }

    handleNext(event) {
      this.state.weekDays[0].setDate(this.state.weekDays[0].getDate() + 7);
      this.state.weekDays[1].setDate(this.state.weekDays[1].getDate() + 7);
      this.state.weekDays[2].setDate(this.state.weekDays[2].getDate() + 7);
      this.state.weekDays[3].setDate(this.state.weekDays[3].getDate() + 7);
      this.state.weekDays[4].setDate(this.state.weekDays[4].getDate() + 7);
      this.updateDashboard();
      this.forceUpdate();
    }
    handlePrevious(event) {
      this.state.weekDays[0].setDate(this.state.weekDays[0].getDate() - 7);
      this.state.weekDays[1].setDate(this.state.weekDays[1].getDate() - 7);
      this.state.weekDays[2].setDate(this.state.weekDays[2].getDate() - 7);
      this.state.weekDays[3].setDate(this.state.weekDays[3].getDate() - 7);
      this.state.weekDays[4].setDate(this.state.weekDays[4].getDate() - 7);
      this.updateDashboard();
      this.forceUpdate();
    }

    onOpenModal = selectedDate => {
      this.setState({ openModal: true, selectedDate });
    };

    onCloseModal = () => {
      this.setState({ openModal: false, selectedDate: undefined });
    };

    render() {
      if (this.state.dashboardReady && this.state.overdueReady) {
        return (
          <div className={"dashboard"}>
            <div className={"overduePatients"}>
              <OverduePatients
                notificationNumber={this.state.overdueTests.length}
                anytimeAppointments={this.state.overdueTests}
              />
            </div>
            <div className={"rightSideDash"}>
              <div className={"navbar"}>
                <Navbar onPrev={this.handlePrevious} onNext={this.handleNext} />
              </div>
              <div className={"bottomSideDash"}>
                <div className={"calendar"}>
                  <WeeklyCalendar
                    calendar={this.state.calendar}
                    weekDays={this.state.weekDays}
                    openModal={this.onOpenModal}
                  />
                </div>
                <div className={"ongoingWeekly"}>
                  <OngoingWeekly
                    currentMonday={this.currentMonday}
                    notificationNumber={this.state.ongoingTests.length}
                    anytimeAppointments={this.state.ongoingTests}
                  />
                </div>
              </div>
            </div>
            <Modal
              open={this.state.openModal}
              onClose={this.onCloseModal}
              showCloseIcon={false}
              style={modalStyles}
              center
            >
              <AddTest
                selectedDate={this.state.selectedDate}
                closeModal={this.onCloseModal}
              />
            </Modal>
          </div>
        );
      } else {
        // TODO loading screen.
        return "";
      }
    }
  }

  const modalStyles = {
    padding: 0
  };

export default Home;
