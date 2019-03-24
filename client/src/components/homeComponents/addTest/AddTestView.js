import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";
import DateSelectorSection from "./DateSelectorSection";
import { getServerConnect } from "../../../serverConnection.js";
import dateformat from "dateformat";
import { openAlert } from "../../Alert";
const DataContainer = styled.div`
  position: relative;
  width: 100%;
  height: 88%;
  background: rgba(0, 0, 0, 0);
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  height: 10%;
`;

const CloseButton = styled.button`
  border: none;
  background-color: #e7e7e7;
  color: black;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;
  margin-right: 4%;

  :hover {
    background: #c8c8c8;
    color: black;
    border-radius: 10px;
  }
  outline: none;
`;

const AddButton = styled.button`
  border: none;
  background-color: #0b999d;
  color: white;
  text-align: center;
  text-decoration: none;
  margin-left: 4%;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
`;

export default class AddTestView extends React.Component {
  state = {
    open: true,
    tooltips: {
      frequency: false,
      occurrences: false
    },
    showCalendar: false,
    selectedID: "",
    selectedDate: dateformat(new Date(this.props.selectedDate), "d mmm yyyy"),
    observations: "",
    allPatients: "",
    frequency: {
      timeAmount: "",
      timeUnits: ["Days", "Weeks", "Months", "Years"],
      timeUnit: "Days",
      occurrences: "",
      noRepeat: true
    }
  };
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.getAllPatients();
  }

  handleError = (res, error) => {
    if (res.errorType === "authentication") {
      openAlert(
        "Authentication failed.",
        "confirmationAlert",
        "Go back to login",
        () => {
          this.props.closeModal();
          this.props.logout();
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

  getAllPatients = () => {
    this.serverConnect.getAllPatients(res => {
      if (res.success) {
        let patients = res.response.map(patient => {
          return {
            name: `${patient.patient_name} ${patient.patient_surname}`,
            id: `${patient.patient_no}`
          };
        });
        this.setState({ allPatients: patients });
      } else {
        this.handleError(res);
      }
    });
  };

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
      let doesNotRepeat = false;
      let frequency = undefined;
      if (parseInt(this.state.frequency.timeAmount)) {
        let { timeUnit, timeAmount } = this.state.frequency;
        timeAmount = parseInt(this.state.frequency.timeAmount);
        timeAmount = timeUnit === "Months" ? timeAmount * 4 : timeAmount;
        timeUnit = timeUnit === "Months" ? "W" : timeUnit;
        timeUnit = timeUnit.charAt(0);
        if (timeAmount === 0) {
          doesNotRepeat = true;
          frequency = null;
        }
        else {
          frequency = `${timeAmount}-${timeUnit}`;
        }
      }
      const { selectedID, selectedDate, observations } = this.state;
      let { occurrences, noRepeat } = this.state.frequency;
      occurrences = (noRepeat 
        || doesNotRepeat 
        || occurrences === null 
        || occurrences === ""
        || occurrences === "0") ? 1 : occurrences;
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
            openAlert(
              "Something went wrong. Test was not added.",
              "confirmationAlert",
              "OK",
              () => {}
            );
          }
        }
      );
    } else {
      openAlert(
        "Please select a patient first.",
        "confirmationAlert",
        "OK",
        () => {}
      );
    }
  };
  render() {
    return (
      <>
        <div
          style={{
            width: "42rem",
            height: "36rem",
            background: "rgba(244, 244, 244,0.7)"
          }}
        >
          <TitleTab onClose={this.props.closeModal} main={true}>
            New appointment
          </TitleTab>
          <DataContainer>
            <PatientSelect
              patients={this.state.allPatients}
              onSelectClick={id => this.setState({ selectedID: id })}
            />

            <DateSelectorSection
              onCalendarClose={this.onCalendarClose}
              frequency={this.state.frequency.timeAmount}
              occurrences={this.state.frequency.occurrences}
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
              showCalendar={this.state.showCalendar}
              noRepeat={this.state.frequency.noRepeat}
              occurrences={this.state.frequency.occurrences}
              timeAmount={this.state.frequency.timeAmount}
              timeUnit={this.state.frequency.timeUnit}
              unitOptions={this.state.frequency.timeUnits}
              noRepeat={this.state.frequency.noRepeat}
              onTimeAmountChange={timeAmount => {
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
                    occurrences: value
                  }
                })
              }
            />
            <ButtonContainer>
              <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
              <AddButton onClick={this.onDoneClick}>Add test</AddButton>
            </ButtonContainer>
          </DataContainer>
        </div>
      </>
    );
  }
}
