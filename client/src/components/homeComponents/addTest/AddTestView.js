import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";
import DateSelectorSection from "./DateSelectorSection";
import { getServerConnect } from "../../../serverConnection.js";

const DataContainer = styled.div`
  position: relative;
  width: 100%;
  height: 88%;
  background: rgba(0, 0, 0, 0);
`;
export default class AddTestView extends React.Component {
  state = {
    open: true,
    selectedID: "",
    selectedDate: this.props.selectedDate,
    observations: "",
    allPatients: "",
    frequency: {
      timeAmount: null,
      timeUnits: ["Days", "Weeks", "Months", "Years"],
      timeUnit: "Days",
      occurrences: 1
    }
  };
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.getAllPatients();
  }

  getAllPatients = () => {
    this.serverConnect.getAllPatients(res => {
      res = res.map(patient => {
        return {
          name: `${patient.patient_name} ${patient.patient_surname}`,
          id: `${patient.patient_no}`
        };
      });
      this.setState({ allPatients: res });
    });
  };
  close = () => {
    this.setState({ open: false });
  };
  onDateSelect = selectedDate => {
    this.setState({ selectedDate });
  };
  onDoneClick = () => {
    if (this.state.selectedID !== "" && this.state.selectedDate !== "") {
      let frequency = undefined;
      if (this.state.frequency.timeAmount) {
        let { timeUnit, timeAmount } = this.state.frequency;
        timeAmount = timeUnit === "Months" ? timeAmount * 4 : timeAmount;
        timeUnit = timeUnit === "Months" ? "W" : timeUnit;
        frequency = `${timeAmount}-${timeUnit}`;
      }
      this.serverConnect.addTest(
        this.state.selectedID,
        this.state.selectedDate,
        this.state.observations,
        frequency,
        this.state.frequency.occurrences
      );
      alert(
        `Patient ID: ${this.state.selectedID} \nObservations: ${
          this.state.observations
        }\nScheduled Date: ${this.state.selectedDate}\nFrequency: ${
          this.state.frequency.timeAmount === "0"
            ? `Do not repeat`
            : `Repeat every ${
                this.state.frequency.timeAmount
              } ${this.state.frequency.timeUnit.toLowerCase()} ${
                this.state.frequency.occurrences
              } times`
        }`
      );
      this.setState({ open: false });
      this.props.closeModal();
    } else {
      alert("Please ensure you have selected all the relevant fields");
    }
  };
  render() {
    console.log(this.state);
    return (
      <>
        <div
          style={{
            width: "35rem",
            height: "30rem",
            background: "rgba(244, 244, 244,0.7)"
          }}
        >
          <TitleTab onClose={this.props.closeModal} main={true}>
            Add Appointments
          </TitleTab>
          <DataContainer>
            <PatientSelect
              patients={this.state.allPatients}
              onDoneClick={this.onDoneClick}
              onSelectClick={id => this.setState({ selectedID: id })}
            />

            <DateSelectorSection
              timeAmount={this.state.frequency.timeAmount}
              timeUnit={this.state.frequency.timeUnit}
              unitOptions={this.state.frequency.timeUnits}
              onTimeAmountChange={timeAmount => {
                timeAmount = parseInt(timeAmount);
                this.setState({
                  frequency: { ...this.state.frequency, timeAmount }
                });
              }}
              onUnitChange={timeUnit =>
                this.setState({
                  frequency: { ...this.state.frequency, timeUnit }
                })
              }
              selectedDate={this.state.selectedDate}
              onDateSelect={day => this.onDateSelect(day)}
              onObservationsChange={observations =>
                this.setState({ observations })
              }
              onOccurrenceChange={value =>
                this.setState({
                  frequency: {
                    ...this.state.frequency,
                    occurrences: value ? parseInt(value) + 1 : 1
                  }
                })
              }
            />
          </DataContainer>
        </div>
      </>
    );
  }
}
