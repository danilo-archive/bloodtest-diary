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
  width: 40%;
  height: 10rem;
  outline: none;
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
      console.log({ res });
      this.setState({
        patient: { name: res.patient_name, id: res.patient_no },
        test: {
          id: res.test_id,
          date: {
            dueDate: dateformat(new Date(res.due_date), "d mmm yyyy"),
            frequency: res.frequency ? res.frequency : "",
            occurrences: res.occurrences,
            noRepeat: res.occurrences === 1
          },
          status:
            res.completed_status === "yes"
              ? "completed"
              : res.completed_status === "no"
              ? "pending"
              : "in review",
          notes: res.notes !== "null" ? res.notes : ""
        },
        showCalendar: false,

        ready: true
      });
    });
  }

  saveTest = () => {
    const { test, patient } = this.state;
    const params = {
      test_id: test.id,
      patient_no: patient.id,
      due_date: dateformat(new Date(test.date.dueDate), "yyyy-mm-dd"),
      frequency: test.date.frequency.length === 0 ? null : test.date.frequency,
      occurrences: test.date.noRepeat ? 1 : test.date.occurrences,
      completed_status:
        test.status === "completed"
          ? "yes"
          : test.status === "in review"
          ? "in review"
          : "no",
      notes: test.notes
    };
    console.log(this.token);
    console.log(params);
    this.serverConnect.editTest(this.state.test.id, params, this.token, res => {
      if (res.success) {
        this.props.closeModal();
      } else {
        alert("Something went wrong");
        this.props.closeModal();
      }
    });
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
            Edit Appointment
          </TitleTab>
          <div style={{ padding: "1rem 1rem" }}>
            <InfoBox
              label={"Full Name"}
              text={this.state.patient.name}
              icon="arrow-circle-right"
              onClick={() => {
                alert("This is supposed to open the patient view");
              }}
            />
            {this.state.showCalendar ? (
              <CalendarTable
                style={{ width: "50%", top: "47%", left: "37%" }}
                onDaySelected={day => {
                  this.setState({
                    showCalendar: false,
                    test: {
                      ...this.state.test,
                      date: {
                        ...this.state.test.date,
                        dueDate: day
                      }
                    }
                  });
                }}
              />
            ) : (
              ``
            )}
            <InfoBox
              label={"Due"}
              text={this.state.test.date.dueDate}
              icon="edit"
              onClick={() => this.setState({ showCalendar: true })}
            />
            <FrequencySelector
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
                time = time === "" ? "0" : time;
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
            <div style={{ display: "flex" }}>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end"
                }}
              >
                <Button save onClick={this.saveTest}>
                  Save Changes
                </Button>
                <Button onClick={() => alert("Unschedule test")}>
                  Unschedule test
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      ``
    );
  }
}
