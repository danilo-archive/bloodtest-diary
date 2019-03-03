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
import {getNextDates, getMondayOfWeek, getCurrentWeek, getPreviousWeek, getNextWeek} from "../lib/calendar-controller";
import {getServerConnect} from "../serverConnection.js";
import {group, getNumberOfTestsInGroup} from "../lib/overdue-controller.js";
import './home.css';

class Home extends Component {

    constructor(props) {
      super(props);
      this.serverConnect = getServerConnect();
      this.serverConnect.joinMainPage();

      this.state = {
        dashboardReady: false,
        overdueReady: false,
        weekDays: getCurrentWeek(),
        overdueTests: {},
        ongoingTests: {},
        calendar: {},
        openModal: false
      };

    }

    componentDidMount = () => {
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
          this.updateDashboard();
      });
    }

    initOnTestStatusChange() {
      this.serverConnect.setOnTestStatusChange((id, status) => {
        // check if it's overdue
        for (var i = 0; i < this.state.overdueTests.length; ++i) {
          let group = this.state.overdueTests[i];
          for (var j = 0; j < group.tests.length ; ++j){
              var test = group.tests[j];
              if (test.test_id === id) {
                let newOverdueTests = [...this.state.overdueTests];
                newOverdueTests[i].tests[j].completed_status = status;
                this.setState({overdueTests: newOverdueTests});
              }
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

    initOverduePanel() {
      this.serverConnect.getOverdueTests(res => {
        this.setState({
            overdueTests: res,
            overdueReady: true
        });
      });
    }

    updateDashboard(newWeek=undefined) {
      let monday = newWeek ? newWeek[0] : this.state.weekDays[0];
      this.serverConnect.getTestsInWeek(monday, res => {
        this.setState( prevState => {return {
              ongoingTests: res[5],
              calendar: res.slice(0, 5),
              dashboardReady: true,
              weekDays: newWeek ? newWeek : prevState.weekDays
          }});
        });
    }

    handleNext(event) {
      let nextWeek = getNextWeek([...this.state.weekDays]);
      this.updateDashboard(nextWeek);
    }

    handlePrevious(event) {
      let previousWeek = getPreviousWeek([...this.state.weekDays]);
      this.updateDashboard(previousWeek);
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
                notificationNumber={getNumberOfTestsInGroup(this.state.overdueTests)}
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
