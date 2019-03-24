import React from "react";
import styled from "styled-components";
import InfoBox from "./InfoBox";
import TitleTab from "../addTest/TitleTab.js";
import CalendarTable from "../../calendarComponents/Calendar";
import FrequencySelector from "./FrequencySelector";
import StatusSetter from "./StatusSetter";
import { getServerConnect } from "../../../serverConnection.js";
import Button from "./Button";
import dateformat from "dateformat";
import { openAlert } from "./../../Alert.js";
import { formatDatabaseDate } from "./../../../lib/calendar-controller.js";
import PatientProfile from "../../patientsComponents/PatientProfile";
import { Tooltip } from "react-tippy";

const DataContainer = styled.div`
  position: relative;
  width: 45rem;
  height: 80px;
  background: rgba(0, 0, 0, 0);
`;
const SetterValues = [
  { value: "D", name: "Days" },
  { value: "W", name: "Weeks" },
  { value: "M", name: "Months" },
  { value: "Y", name: "Years" }
];

const TextArea = styled.textarea`
  width: 100%;
  height: 7rem;
  outline: none;
  resize: none;
  overflow: scroll;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  margin-top: 1%;
`;

export default class EditTestView extends React.Component {
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.token = props.token;
    this.state = {
      ready: false
    };
    this.init();
  }

  init() {
    this.serverConnect.getTestInfo(this.props.testId, res => {
      this.setState({
        showPatient: false,
        tooltips: {
          frequency: false,
          occurrences: false
        },
        patientToken: -1,
        patient: { name: res.patient_name, id: res.patient_no },
        test: {
          id: res.test_id,
          date: {
            dueDate: dateformat(new Date(res.due_date), "d mmm yyyy"),

            frequency:
              res.frequency &&
              res.frequency !== "null" &&
              res.frequency !== null
                ? res.frequency
                : "0-D",
            occurrences: res.occurrences,
            noRepeat: res.frequency === null
          },
          status:
            res.completed_status === "yes"
              ? "completed"
              : res.completed_status === "no"
              ? "pending"
              : "in review",
          notes: res.notes !== "null" && res.notes !== null ? res.notes : ""
        },
        showCalendar: false,

        ready: true
      });
    });
  }

  onCalendarClose = () => {
    this.setState({showCalendar: false});
  }

  saveTest = () => {
    const { test, patient } = this.state;
    let freq = null;
    if (test.date.frequency.length > 0 && test.date.frequency.split("-")[0] !== "0") {
      if (test.date.frequency.split("-")[1] === "M") {
        freq = `${parseInt(test.date.frequency.split("-")[0]) * 4}-W`;
      }
      else {
        freq = test.date.frequency;
      }
    }

    let occur;
    if (test.date.noRepeat || 
        freq === null || 
        test.date.occurrences === null || 
        test.date.occurrences === "" ||
        test.date.occurrences === 0) {
          occur = 1;
    }
    else {
      occur = test.date.occurrences;
    }

    const params = {
      test_id: test.id,
      patient_no: patient.id,
      due_date: dateformat(new Date(test.date.dueDate), "yyyy-mm-dd"),
      frequency: freq,
      occurrences: occur,
      completed_status:
        test.status === "completed"
          ? "yes"
          : test.status === "in review"
          ? "in review"
          : "no",
      notes: test.notes
    };
    this.serverConnect.editTest(this.state.test.id, params, this.token, res => {
      if (res.success) {
        if (res.response.insertId != undefined) {
          openAlert(
            `A new test has been automatically scheduled for on ${formatDatabaseDate(
              res.response.new_date
            )}.`,
            "confirmationAlert",
            "OK",
            () => {
              this.props.closeModal();
            }
          );
        } else {
          this.props.closeModal();
        }
      } else {
        openAlert("Something went wrong.", "confirmationAlert", "OK", () => {
          this.props.closeModal();
        });
      }
    });
  };

  unscheduleTest = () => {
    openAlert(
      "Are you sure you want to unschedule this test?",
      "optionAlert",
      "No",
      () => {
        return;
      },
      "Yes",
      () => {
        this.serverConnect.unscheduleTest(
          this.state.test.id,
          this.token,
          res => {
            if (res.success) {
              openAlert(
                "Test successfully unscheduled.",
                "confirmationAlert",
                "OK",
                () => {
                  this.props.closeModal();
                }
              );
            } else {
              openAlert(res.response, "confirmationAlert", "Ok", () => {
                this.props.closeModal();
              });
            }
          }
        );
      }
    );
  };

  render() {
    return this.state.ready ? (
      <>
        <div
          style={{
            width: "35rem",
            height: "38rem",
            background: "rgba(244, 244, 244,0.7)",
            position: "relative"
          }}
        >
          <TitleTab onClose={this.props.closeModal} main={true}>
            Edit appointment
          </TitleTab>
          <div style={{ padding: "1rem 1rem" }}>
            <InfoBox
              label={"Full name:"}
              text={this.state.patient.name}
              icon={undefined}
            />
            {this.state.showCalendar ? (
              <CalendarTable
                outsideClick={this.onCalendarClose}
                style={{ width: "50%", top: "47%", left: "37%" }}
                onDayPick={day => {
                  this.setState({
                    showCalendar: false,
                    test: {
                      ...this.state.test,
                      date: {
                        ...this.state.test.date,
                        dueDate: dateformat(day, "d mmm yyyy")
                      }
                    }
                  });
                }}
              />
            ) : (
              ``
            )}
            <InfoBox
              label={"Due date:"}
              text={this.state.test.date.dueDate}
              icon="edit"
              onClick={() => this.setState({ showCalendar: true })}
            />
            <FrequencySelector
              tooltips={{
                frequency: this.state.tooltips.frequency,
                occurrences: this.state.tooltips.occurrences
              }}
              setFrequencyTooltip={state =>
                this.setState({
                  tooltips: { ...this.state.tooltips, frequency: state }
                })
              }
              setOcurrencesTooltip={state =>
                this.setState({
                  tooltips: { ...this.state.tooltips, occurrences: state }
                })
              }
              noRepeat={this.state.test.date.noRepeat}
              onCheck={check =>
                this.setState({
                  test: {
                    ...this.state.test,
                    date: { ...this.state.test.date, noRepeat: check }
                  }
                })
              }
              values={SetterValues}
              frequencyTimes={
                this.state.test.date.frequency.split("-")[0] !== "0"
                  ? this.state.test.date.frequency.split("-")[0]
                  : ""
              }
              frequencyUnit={
                this.state.test.date.frequency[
                  this.state.test.date.frequency.length - 1
                ]
              }
              occurrences={this.state.test.date.occurrences}
              onUnitChange={unit =>
                this.setState({
                  showCalendar: false,
                  test: {
                    ...this.state.test,
                    date: {
                      ...this.state.test.date,
                      frequency: `${this.state.test.date.frequency.slice(
                        0,
                        -1
                      )}${unit}`
                    }
                  }
                })
              }
              onFrequencyChange={time => {
                time = time === "" || time === "-" ? "0" : time;
                this.setState({
                  showCalendar: false,
                  test: {
                    ...this.state.test,
                    date: {
                      ...this.state.test.date,
                      frequency: `${time}-${
                        this.state.test.date.frequency.split("-")[1]
                      }`
                    }
                  }
                });
              }}
              onOccurrencesChange={value => {
                this.setState({
                  showCalendar: false,
                  test: {
                    ...this.state.test,
                    date: {
                      ...this.state.test.date,
                      occurrences: value
                    }
                  }
                });
              }}
            />
            <hr />
            <StatusSetter
              currentStatus={this.state.test.status}
              onStatusCheck={(status, checked) => {
                if (checked) {
                  this.setState({ test: { ...this.state.test, status } });
                }
              }}
            />
            <hr />
            <div >
              <TextArea
                value={this.state.test.notes}
                onChange={event =>
                  this.setState({
                    test: {
                      ...this.state.test,
                      notes: event.target.value
                    }
                  })
                }
              />
              <ButtonsContainer>
                <Button backgroundColor={"#0b999d"} hoverColor={"#018589"} onClick={this.saveTest}>Save changes</Button>
                <Button backgroundColor={"#f44336"} hoverColor={"#dc2836"} onClick={this.unscheduleTest}>Unschedule test</Button>
                <Button backgroundColor={"#aaaaaa"} hoverColor={"#c8c8c8"} onClick={this.props.closeModal}>Close</Button>
              </ButtonsContainer>
            </div>
          </div>
        </div>
      </>
    ) : (
      ``
    );
  }
}
