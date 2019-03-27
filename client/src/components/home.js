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
import PatientProfile from "./patientsComponents/PatientProfile.js";
import {
  getNextDates,
  getMondayOfWeek,
  getCurrentWeek,
  getWeekDays,
  getPreviousWeek,
  getNextWeek
} from "../lib/calendar-controller";
import { getServerConnect } from "../serverConnection.js";
import { group, getNumberOfTestsInGroup } from "../lib/overdue-controller.js";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import CustomDragLayer from "./homeComponents/CustomDragLayer.js";
import "../styles/global.css";

const Dashboard = styled.div`
  border: blue 0px solid;
  height: calc(103vh - 88px);
  width: auto;
  position: relative;
  top: 20px;
  padding: 1% 1% 1% 1%;

  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const RightSideDash = styled.div`
  border: red 0 solid;
  height: 100%;
  width: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;


  flex-grow: 5;
  flex-shrink: 1;
`;
const BottomSideDash = styled.div`
  border: green 0 solid;
  height: auto;
  width: auto;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;


  flex-grow: 1;
  flex-shrink: 1;
`;

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
      openEditPatientModal: false,
      editTestId: undefined,
      editToken: undefined,
      notified: undefined,
      notNotified: undefined,
      editPatientId: undefined,
      editPatientToken: undefined
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
        "Authentication failed.",
        "confirmationAlert",
        "Go back to login",
        () => {
          this.logout();
        }
      );
    } else {
      openAlert(
        `${error ? error : "Unknown error occurred."}`,
        "confirmationAlert",
        "OK",
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

  jumpToWeek = day => {
    this.updateDashboard(getWeekDays(day));
  }

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
          "Somebody is already editing this test."
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

  openEditPatientModal = id => {
    this.serverConnect.requestPatientEditing(id, res => {
      if (res.token){
          this.setState({editPatientId: id, openEditPatientModal: true, editPatientToken: res.token});
      }else{
          this.handleInvalidResponseError(res, "Somebody is already editing this patient.");
      }
    });
  }

  onCloseEditPatientModal = () => {
    this.serverConnect.discardPatientEditing(this.state.editPatientId, this.state.editPatientToken, res => {
      this.setState({editPatientId: undefined, openEditPatientModal: false, editPatientToken: undefined});
    });
  }

  render() {
    if (this.state.dashboardReady && this.state.overdueReady) {
      return (
        <ModalProvider>
            <CustomDragLayer snapToGrid={true} />
            <Dashboard>
               <OverduePatients
                  openEmailModal={this.openEmailModal}
                  notificationNumber={getNumberOfTestsInGroup(
                    this.state.overdueTests
                  )}
                  anytimeAppointments={this.state.overdueTests}
                  editTest={this.onEditTestOpenModal}
                  editPatient={this.openEditPatientModal}
                  handleError={this.handleInvalidResponseError}
                  openEmailModal={this.openEmailModal}
              />
              <RightSideDash>
                  <Navbar
                    handleError={this.handleInvalidResponseError}
                    over12={!this.state.under12}
                    setUnder12={check => {
                      check
                        ? this.serverConnect.setUnderTwelve()
                        : this.serverConnect.setOverTwelve();
                      this.setState({ under12: !check });
                      this.refresh();
                    }}
                    page="Dashboard"
                    onDayPick={this.jumpToWeek}
                    onPrev={this.handlePrevious}
                    onNext={this.handleNext}
                    onPatientsClick={this.onPatientsClick}
                    onSignoutClick={this.logout}
                    refresh={this.refresh}
                  />
                <BottomSideDash>
                    <WeeklyCalendar
                      calendar={this.state.calendar}
                      weekDays={this.state.weekDays}
                      openModal={this.onAddTestOpenModal}
                      editTest={this.onEditTestOpenModal}
                      editPatient={this.openEditPatientModal}
                      handleError={this.handleInvalidResponseError}
                    />
                    <OngoingWeekly
                      currentMonday={this.currentMonday}
                      date={this.state.weekDays[5]}
                      notificationNumber={this.state.ongoingTests.length}
                      anytimeAppointments={this.state.ongoingTests}
                      editTest={this.onEditTestOpenModal}
                      editPatient={this.openEditPatientModal}
                      handleError={this.handleInvalidResponseError}
                    />
                </BottomSideDash>
              </RightSideDash>
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
              <Modal
                  open={this.state.openEditPatientModal}
                  onClose={this.onCloseEditPatientModal}
                  showCloseIcon={false}
                  style={modalStyles}
                  center
              >
                <PatientProfile
                    patientId={this.state.editPatientId}
                    closeModal={this.onCloseEditPatientModal}
                    editToken={this.state.editPatientToken}
                    purpose={"Edit patient"}
                    handleError={this.handleInvalidResponseError}
                />
              </Modal>
            </Dashboard>
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
