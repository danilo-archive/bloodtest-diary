import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";
import DateSelectorSection from "./DateSelectorSection";

const DataContainer = styled.div`
  position: relative;
  width: 100%;
  height: 88%;
  background: rgba(0, 0, 0, 0);
`;
export default class AddTestView extends React.Component {
  state = { open: true, selectedID: "", selectedDate: "", observations: "" };
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
                patients={[
                  { name: "John Smith", id: "1740982" },
                  { name: "Juan Mexican", id: "098765" },
                  { name: "El Barto", id: "123456789" },
                  { name: "El Barto", id: "123456789" },
                  { name: "El Barto", id: "123456789" }
                ]}
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
