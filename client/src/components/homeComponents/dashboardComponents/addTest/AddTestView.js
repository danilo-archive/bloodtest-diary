import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";
import DateSelectorSection from "./DateSelectorSection";
import { getServerConnect } from "../../../../serverConnection.js";

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
    selectedDate: "",
    observations: "",
    allPatients: ""
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
      alert(
        `Patient ID: ${this.state.selectedID} \nObservations: ${
          this.state.observations
        }\nScheduled Date: ${this.state.selectedDate}`
      );
      this.setState({ open: false });
    } else {
      alert("Please ensure you have selected all the relevant fields");
    }
  };
  render() {
    return (
      <>
        {this.state.open ? (
          <div
            style={{
              width: "35rem",
              height: "30rem",
              background: "rgba(244, 244, 244,0.7)"
            }}
          >
            <TitleTab onClose={this.close} main={true}>
              Add Appointments
            </TitleTab>
            <DataContainer>
              <PatientSelect
                patients={this.state.allPatients}
                onDoneClick={this.onDoneClick}
                onSelectClick={id => this.setState({ selectedID: id })}
              />

              <DateSelectorSection
                onDateSelect={day => this.onDateSelect(day)}
                onObservationsChange={observations =>
                  this.setState({ observations })
                }
              />
            </DataContainer>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
