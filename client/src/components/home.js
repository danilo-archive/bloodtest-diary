import React, { Component } from 'react';
import styled from "styled-components";
import Modal from 'react-responsive-modal';

import Navbar from "./homeComponents/navbar";
import OverduePatients from "./homeComponents/overduePatients";
import WeeklyCalendar from "./homeComponents/weeklyCalendar";
import OngoingWeekly from "./homeComponents/ongoingWeekly";
import AddTest from "./homeComponents/addTest/AddTestView";
import EditTest from "./homeComponents/editTest/EditTestView";
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
        openAddTestModal: false,
        openEditTestModal: false,
        editTestId: undefined,
        editToken: undefined
      };

    }

    onPatientsClick(event) {
        this.props.history.push("patients")
    }

    componentDidMount = () => {
        this.initOverduePanel();
        this.updateDashboard();
        this.initCallbacks();

        this.handleNext = this.handleNext.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.onPatientsClick = this.onPatientsClick.bind(this);

        this.onAddTestOpenModal = this.onAddTestOpenModal.bind(this);
        this.onAddTestCloseModal = this.onAddTestCloseModal.bind(this);
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
        this.modifyTest(id, test => {
            test.completed_status = status;
            return test;
        });
      });
    }

    initOnTestEdit(){
        this.serverConnect.setOnTestEdit((id, newTest) => {
            this.modifyTest(id, test => {
                test = newTest;
                return newTest;
            });
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
      newWeek = newWeek ? newWeek : this.state.weekDays;
      this.serverConnect.getTestsInWeek(monday, res => {
        this.setState({
              ongoingTests: res[5],
              calendar: res.slice(0, 5),
              dashboardReady: true,
              weekDays: newWeek
          });
        });
    }

    modifyTest(id, modificationFunction){
        for (var i = 0; i < this.state.overdueTests.length; ++i) {
          let group = this.state.overdueTests[i];
          for (var j = 0; j < group.tests.length ; ++j){
              var test = group.tests[j];
              if (test.test_id === id) {
                let newOverdueTests = [...this.state.overdueTests];
                let testToModify = newOverdueTests[i].tests[j]
                let modifiedTest = modificationFunction(testToModify);
                newOverdueTests[i].tests[j] = modifiedTest;
                this.setState({overdueTests: newOverdueTests});
              }
          }
        }
        // check if it's ongoing
        for (var i = 0; i < this.state.ongoingTests.length; ++i) {
          var test = this.state.ongoingTests[i];
          if (test.test_id === id) {
            let newOngoingTests = [...this.state.ongoingTests];
            let testToModify = newOngoingTests[i];
            let modifiedTest = modificationFunction(testToModify);
            newOngoingTests[i] = modifiedTest;
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
              let testToModify = newCalendar[i][j];
              let modifiedTest = modificationFunction(testToModify);
              newCalendar[i][j] = modifiedTest;
              this.setState({calendar: newCalendar});
              return;
            }
          }
        }
      }

    handleNext(event) {
      let nextWeek = getNextWeek([...this.state.weekDays]);
      this.updateDashboard(nextWeek);
    }

    handlePrevious(event) {
      let previousWeek = getPreviousWeek([...this.state.weekDays]);
      this.updateDashboard(previousWeek);
    }

    onAddTestOpenModal = selectedDate => {
      this.setState({ openAddTestModal: true, selectedDate });
    };

    onAddTestCloseModal = () => {
      this.setState({ openAddTestModal: false, selectedDate: undefined });
    };

    onEditTestOpenModal = testId => {
        this.serverConnect.requestTestEditing(testId, token => {
          if (token != undefined){
            this.setState({openEditTestModal: true, editTestId: testId, editToken: token});
          }
        });
    };

    onEditTestCloseModal = () => {
        // TODO remove token if not used
        this.setState({openEditTestModal: false, editTestId: undefined, editToken: undefined});
    };

    render() {
      if (this.state.dashboardReady && this.state.overdueReady) {
        return (
          <div className={"dashboard"}>
            <div className={"overduePatients"}>
              <OverduePatients
                notificationNumber={getNumberOfTestsInGroup(this.state.overdueTests)}
                anytimeAppointments={this.state.overdueTests}
                editTest={this.onEditTestOpenModal}
              />
            </div>
            <div className={"rightSideDash"}>
              <div className={"navbar"}>
                <Navbar
                    onPrev={this.handlePrevious}
                    onNext={this.handleNext}
                    onPatientsClick={this.onPatientsClick}
                />
              </div>
              <div className={"bottomSideDash"}>
                <div className={"homecalendar"}>
                  <WeeklyCalendar
                    calendar={this.state.calendar}
                    weekDays={this.state.weekDays}
                    openModal={this.onAddTestOpenModal}
                    editTest={this.onEditTestOpenModal}
                  />
                </div>
                <div className={"ongoingWeekly"}>
                  <OngoingWeekly
                    currentMonday={this.currentMonday}
                    notificationNumber={this.state.ongoingTests.length}
                    anytimeAppointments={this.state.ongoingTests}
                    editTest={this.onEditTestOpenModal}
                  />
                </div>
              </div>
            </div>
            <Modal
              open={this.state.openAddTestModal}
              onClose={this.onAddTestCloseModal}
              showCloseIcon={false}
              style={modalStyles}
              center
            >
              <AddTest
                selectedDate={this.state.selectedDate}
                closeModal={this.onAddTestCloseModal}
              />
            </Modal>
            <Modal
                open={this.state.openEditTestModal}
                onClose={this.onEditTestCloseModal}
                showCloseIcon={false}
                style={modalStyles}
                center
            >
              <EditTest
                 testId = {this.state.editTestId}
                 closeModal={this.onEditTestCloseModal}
                 token={this.state.editToken}
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
