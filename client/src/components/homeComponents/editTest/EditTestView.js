import React from "react";
import styled from "styled-components";
import InfoBox from "./InfoBox";
import TitleTab from "../addTest/TitleTab.js";
import CalendarTable from "../../calendarComponents/Calendar";
import FrequencySelector from "./FrequencySelector";
import StatusSetter from "./StatusSetter";

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
export default class EditTestView extends React.Component {
  state = {
    patient: { name: this.props.patient.name, id: this.props.patient.id },
    test: {
      id: this.props.test.id,
      date: {
        dueDate: this.props.test.date.dueDate,
        frequency: this.props.test.date.frequency,
        occurrences: this.props.test.date.occurrences
      },
      status: this.props.test.status
    },
    showCalendar: false
  };
  render() {
    console.log(this.state.test.date.frequency[-1]);
    return (
      <>
        <div
          style={{
            width: "35rem",
            height: "30rem",
            background: "rgba(244, 244, 244,0.7)",
            position: "relative"
          }}
        >
          <TitleTab main={true}>Edit Appointment</TitleTab>
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
              currentStatus={this.state.status}
              onStatusCheck={(status, checked) => {
                if (checked) {
                  this.setState({ status });
                }
              }}
            />
          </div>
        </div>
      </>
    );
  }
}
