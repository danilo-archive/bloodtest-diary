import React, { Component } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { ModalProvider } from "styled-react-modal";
import Navbar from "./homeComponents/navbar";
import OverduePatients from "./homeComponents/overduePatients";
import WeeklyCalendar from "./homeComponents/weeklyCalendar";
import OngoingWeekly from "./homeComponents/ongoingWeekly";
import AddTest from "./homeComponents/addTest/AddTestView";
import VerticalLine from "./homeComponents/calendarComponents/VerticalLine";
import LoadingAnimation from "./loadingScreen/loadingAnimation";
import { openAlert } from "./Alert.js"

import EditTest from "./homeComponents/editTest/EditTestView";
import {
  getNextDates,
  getMondayOfWeek,
  getCurrentWeek,
  getPreviousWeek,
  getNextWeek
} from "../lib/calendar-controller";
import { getServerConnect } from "../serverConnection.js";
import { group, getNumberOfTestsInGroup } from "../lib/overdue-controller.js";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import CustomDragLayer from "./homeComponents/CustomDragLayer.js";
import "./home.css";

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

  componentDidMount = () => {
    this.initOverduePanel();
    this.updateDashboard();
    this.initCallbacks();

    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.onPatientsClick = this.onPatientsClick.bind(this);

    this.onAddTestOpenModal = this.onAddTestOpenModal.bind(this);
    this.onAddTestCloseModal = this.onAddTestCloseModal.bind(this);
  };

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
      this.updateDashboard();
      this.modifyOverdueTest(id, test => {
        test.completed_status = status;
        return test;
      });
    });
  }

  initOnTestEdit() {
    this.serverConnect.setOnTestEdit((id, newTest) => {
      this.updateDashboard();
      this.modifyOverdueTest(id, test => {
        test = newTest;
        return newTest;
      });
    });
  }

  handleInvalidResponseError(){
      openAlert("Authentication with server failed", "confirmationAlert", "Go back to Login", () => {
         this.logout();
      });
  }

  initOverduePanel() {
    this.serverConnect.getOverdueTests(res => {
      if (res.success){
          this.setState({
            overdueTests: res.response,
            overdueReady: true
          });
      }else{
          this.handleInvalidResponseError();
      }
    });
  }

  updateDashboard(newWeek = undefined) {
    let monday = newWeek ? newWeek[0] : this.state.weekDays[0];
    newWeek = newWeek ? newWeek : this.state.weekDays;
    this.serverConnect.getTestsInWeek(monday, res => {
      if (res.success){
          this.setState({
            ongoingTests: res.response[5],
            calendar: res.response.slice(0, 5),
            dashboardReady: true,
            weekDays: newWeek
          });
      }else{
          this.handleInvalidResponseError();
      }
    });
  }

  modifyOverdueTest(id, modificationFunction) {
    for (var i = 0; i < this.state.overdueTests.length; ++i) {
      let group = this.state.overdueTests[i];
      for (var j = 0; j < group.tests.length; ++j) {
        var test = group.tests[j];
        if (test.test_id === id) {
          let newOverdueTests = [...this.state.overdueTests];
          let testToModify = newOverdueTests[i].tests[j];
          let modifiedTest = modificationFunction(testToModify);
          newOverdueTests[i].tests[j] = modifiedTest;
          this.setState({ overdueTests: newOverdueTests });
        }
      }
    }
  }

  modifyTest(id, modificationFunction) {
    for (var i = 0; i < this.state.overdueTests.length; ++i) {
      let group = this.state.overdueTests[i];
      for (var j = 0; j < group.tests.length; ++j) {
        var test = group.tests[j];
        if (test.test_id === id) {
          let newOverdueTests = [...this.state.overdueTests];
          let testToModify = newOverdueTests[i].tests[j];
          let modifiedTest = modificationFunction(testToModify);
          newOverdueTests[i].tests[j] = modifiedTest;
          this.setState({ overdueTests: newOverdueTests });
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
        this.setState({ ongoingTests: newOngoingTests });
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
          this.setState({ calendar: newCalendar });
          return;
        }
      }
    }
  }

  refresh(event) {
    console.log("refresh");
    this.updateDashboard();
    this.initOverduePanel();
  }

  onPatientsClick(event) {
    this.props.history.push("patients");
  }

  refresh(event) {
    console.log("refresh");
    this.updateDashboard();
    this.initOverduePanel();
  }

  logout(event) {
    this.serverConnect.deleteLoginToken();
    this.props.history.replace("");
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
      if (token != undefined) {
        this.setState({
          openEditTestModal: true,
          editTestId: testId,
          editToken: token
        });
      } else {
        openAlert("Somebody is aready editing this test", "confirmationAlert", "Ok");
      }
    });
  };

  onEditTestCloseModal = () => {
    const { editToken, editTestId } = this.state;
    this.serverConnect.discardTestEditing(editTestId, editToken, res => {
      this.setState({
        openEditTestModal: false,
        editTestId: undefined,
        editToken: undefined
      });
    });
  };

  render() {
    if (this.state.dashboardReady && this.state.overdueReady) {
      return (
        <ModalProvider>
          <div className={"home"}>
            <CustomDragLayer snapToGrid={true} />
            <div className={"dashboard"}>
              <div className={"overduePatients"}>
                <OverduePatients
                  notificationNumber={getNumberOfTestsInGroup(
                    this.state.overdueTests
                  )}
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
                    onSignoutClick={this.logout}
                    refresh={this.refresh}
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
                  <div className={"divider"} />
                  <div className={"ongoingWeekly"}>
                    <OngoingWeekly
                      currentMonday={this.currentMonday}
                      date={this.state.weekDays[5]}
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
                styles={modalStyles}
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
                center
              >
                <EditTest
                  testId={this.state.editTestId}
                  closeModal={this.onEditTestCloseModal}
                  openModal={this.onEditTestOpenModal}
                  token={this.state.editToken}
                />
              </Modal>
            </div>
          </div>
        </ModalProvider>
      );
    } else {
      return (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)"
          }}
        >
          <LoadingAnimation />
        </div>
      );
    }
  }
}

const modalStyles = {
  "& > div": {
    padding: "0"
  }
};

export default DragDropContext(HTML5Backend)(Home);
//export default Home;
