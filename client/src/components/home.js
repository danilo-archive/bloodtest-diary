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
import { openAlert } from "./Alert.js";
import EmailModal from "./homeComponents/emailModal/EmailModal.js";
import ColorPicker from "./homeComponents/calendarComponents/ColorPicker.js";

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
      under12: this.serverConnect.isUnderTwelve(),
      dashboardReady: false,
      overdueReady: false,
      weekDays: getCurrentWeek(),
      overdueTests: {},
      ongoingTests: {},
      calendar: {},
      openAddTestModal: false,
      openEditTestModal: false,
      openEmailModal: false,
      editTestId: undefined,
      editToken: undefined,
      notified: undefined,
      notNotified: undefined
    };
  }

  componentDidMount = () => {
    this.initOverduePanel();
    this.updateDashboard();
    this.initCallbacks();
  };

  initCallbacks() {
    this.initOnTestAdded();
  }

  initOnTestAdded() {
    this.serverConnect.setOnTestAdded(newTest => {
      this.updateDashboard();
      this.initOverduePanel();
    });
  }

  initOverduePanel() {
    this.serverConnect.getOverdueTests(res => {
      if (res.success) {
        this.setState({
          overdueTests: res.response,
          overdueReady: true
        });
      } else {
        this.handleInvalidResponseError(res);
      }
    });
  }

  handleInvalidResponseError = (res, error) => {
    if (res.errorType === "authentication") {
      openAlert(
        "Authentication with server failed",
        "confirmationAlert",
        "Go back to Login",
        () => {
          this.logout();
        }
      );
    } else {
      openAlert(
        `${error ? error : "Unknown error occurred"}`,
        "confirmationAlert",
        "Ok",
        () => {
          return;
        }
      );
    }
  };

  updateDashboard = (newWeek = undefined) => {
    let monday = newWeek ? newWeek[0] : this.state.weekDays[0];
    newWeek = newWeek ? newWeek : this.state.weekDays;
    this.serverConnect.getTestsInWeek(monday, res => {
      if (res.success) {
        this.setState({
          ongoingTests: res.response[5],
          calendar: res.response.slice(0, 5),
          dashboardReady: true,
          weekDays: newWeek
        });
      } else {
        this.handleInvalidResponseError(res);
      }
    });
  };

  refresh = event => {
    this.updateDashboard();
    this.initOverduePanel();
  };

  onPatientsClick = event => {
    this.props.history.push("patients");
  };

  logout = event => {
    this.serverConnect.logout(res => {
      this.props.history.replace("");
    });
  };

  handleNext = event => {
    let nextWeek = getNextWeek([...this.state.weekDays]);
    this.updateDashboard(nextWeek);
  };

  handlePrevious = event => {
    let previousWeek = getPreviousWeek([...this.state.weekDays]);
    this.updateDashboard(previousWeek);
  };

  onAddTestOpenModal = selectedDate => {
    this.setState({ openAddTestModal: true, selectedDate });
  };

  onAddTestCloseModal = () => {
    this.setState({ openAddTestModal: false, selectedDate: undefined });
  };

  onEditTestOpenModal = testId => {
    this.serverConnect.requestTestEditing(testId, res => {
      if (res.success) {
        this.setState({
          openEditTestModal: true,
          editTestId: testId,
          editToken: res.token
        });
      } else {
        this.handleInvalidResponseError(
          res,
          "Somebody is aready editing this test"
        );
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

  openEmailModal = () => {
    this.serverConnect.getOverdueReminderGroups(res => {
      console.log(res);
      if (res.success) {
        this.setState({
          openEmailModal: true,
          notNotified: res.response.notReminded,
          notified: res.response.reminded
        });
      } else {
        this.handleInvalidResponseError(res);
      }
      //this.setState({openEmailModal: true});
    });
  };

  onEmailCloseModal = () => {
    this.setState({ openEmailModal: false });
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
                  openEmailModal={this.openEmailModal}
                  notificationNumber={getNumberOfTestsInGroup(
                    this.state.overdueTests
                  )}
                  anytimeAppointments={this.state.overdueTests}
                  editTest={this.onEditTestOpenModal}
                  handleError={this.handleInvalidResponseError}
                />
              </div>
              <div className={"rightSideDash"}>
                <div className={"navbar"}>
                  <Navbar
                    over12={!this.state.under12}
                    setUnder12={check => {
                      check
                        ? this.serverConnect.setUnderTwelve()
                        : this.serverConnect.setOverTwelve();
                      this.setState({ under12: !check });
                      this.refresh();
                    }}
                    page="Dashboard"
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
                      handleError={this.handleInvalidResponseError}
                    />
                  </div>
                  <div className={"ongoingWeekly"}>
                    <OngoingWeekly
                      currentMonday={this.currentMonday}
                      date={this.state.weekDays[5]}
                      notificationNumber={this.state.ongoingTests.length}
                      anytimeAppointments={this.state.ongoingTests}
                      editTest={this.onEditTestOpenModal}
                      handleError={this.handleInvalidResponseError}
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
                  logout={this.logout}
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
              <Modal
                open={this.state.openEmailModal}
                onClose={this.onEmailCloseModal}
                showCloseIcon={false}
                center
              >
                <EmailModal
                  closeModal={this.onEmailCloseModal}
                  notNotified={this.state.notNotified}
                  notified={this.state.notified}
                  handleError={this.handleInvalidResponseError}
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
