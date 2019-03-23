import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";
import DateSelectorSection from "./DateSelectorSection";
import { getServerConnect } from "../../../serverConnection.js";
import dateformat from "dateformat";
import {openAlert} from "../../Alert";
const DataContainer = styled.div`
  position: relative;
  width: 100%;
  height: 88%;
  background: rgba(0, 0, 0, 0);
`;
export default class AddTestView extends React.Component {
  state = {
    open: true,
    showCalendar: false,
    selectedID: "",
    selectedDate: dateformat(new Date(this.props.selectedDate), "d mmm yyyy"),
    observations: "",
    allPatients: "",
    frequency: {
      timeAmount: null,
      timeUnits: ["Days", "Weeks", "Months", "Years"],
      timeUnit: "Days",
      occurrences: 1,
      noRepeat: false
    }
  };
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.getAllPatients();
  }

  handleError = (res, error) => {
      if (res.errorType === "authentication"){
          openAlert("Authentication error", "confirmationAlert",
          "Go back to login", () => {
              this.props.closeModal();
              this.props.logout();
            });
      }else{
          openAlert(`${error ? error : "Unknown error occurred"}`, "confirmationAlert", "Ok", () => {return});
      }
  }

  getAllPatients = () => {
    this.serverConnect.getAllPatients(res => {
      if (res.success){
          let patients = res.response.map(patient => {
            return {
              name: `${patient.patient_name} ${patient.patient_surname}`,
              id: `${patient.patient_no}`
            };
          });
          this.setState({ allPatients: patients });
        }else{
            this.handleError(res);
        }
    });
  }

  onCalendarClose = () => {
    this.setState({showCalendar: false});
  }

  close = () => {
    this.setState({ open: false });
  };
  onDateSelect = selectedDate => {
    this.setState({ showCalendar: false, selectedDate: dateformat(selectedDate, "d mmm yyyy")});
  };
  onDoneClick = () => {
    if (this.state.selectedID !== "" && this.state.selectedDate !== "") {
      let frequency = undefined;
      if (this.state.frequency.timeAmount) {
        let { timeUnit, timeAmount } = this.state.frequency;
        timeAmount = timeUnit === "Months" ? timeAmount * 4 : timeAmount;
        timeUnit = timeUnit === "Months" ? "W" : timeUnit;
        timeUnit = timeUnit.charAt(0);
        frequency = `${timeAmount}-${timeUnit}`;
      }
      const { selectedID, selectedDate, observations } = this.state;
      let { occurrences, noRepeat } = this.state.frequency;
      occurrences = noRepeat ? 1 : occurrences;
      this.serverConnect.addTest(
        selectedID,
        dateformat(new Date(selectedDate), "yyyymmdd"),
        observations,
        frequency,
        occurrences,
        res => {
          if (res.success) {
            this.setState({ open: false });
            this.props.closeModal();
          } else {
            alert("something went wrong, test was not added");
          }
        }
      );
    } else {
      alert("Please ensure you have selected all the relevant fields");
    }
  };
  render() {
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
              onCalendarClose={this.onCalendarClose}
              showCalendar={this.state.showCalendar}
              noRepeat={this.state.frequency.noRepeat}
              occurrences={this.state.frequency.occurrences}
              timeAmount={this.state.frequency.timeAmount}
              timeUnit={this.state.frequency.timeUnit}
              unitOptions={this.state.frequency.timeUnits}
              onTimeAmountChange={timeAmount => {
                timeAmount = parseInt(timeAmount);
                this.setState({
                  frequency: { ...this.state.frequency, timeAmount }
                });
              }}
              onNoRepeatChange={value =>
                this.setState({
                  frequency: { ...this.state.frequency, noRepeat: value }
                })
              }
              onUnitChange={timeUnit =>
                this.setState({
                  frequency: { ...this.state.frequency, timeUnit }
                })
              }
              selectedDate={this.state.selectedDate}
              onInputClick={() => this.setState({ showCalendar: true })}
              onDayPick={day => this.onDateSelect(day)}
              onObservationsChange={observations =>
                this.setState({ observations })
              }
              onOccurrenceChange={value =>
                this.setState({
                  frequency: {
                    ...this.state.frequency,
                    occurrences: value ? parseInt(value) : 1
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
