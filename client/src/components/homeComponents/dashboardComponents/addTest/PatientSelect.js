import React from "react";
import styled from "styled-components";

import SearchBar from "./SearchBar";
import TitleTab from "./TitleTab";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import PatientBox from "./PatientBox";
import ScrollBox from "../calendarComponents/ScrollBox";

const Container = styled.div`
  height: 100%;
  width: 50%;
  background: rgba(244, 244, 244, 0.7);
  float: right;
  border-left: solid 1px grey;
`;
const ShowID = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const DoneButton = styled.button`
  appearance: none;
  width: 100%;
  height: 10%;
  top: 0;
  left: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #0d4e56;
  font-size: 1.25rem;
  cursor: pointer;
  outline: none;
  border-radius: 0;
`;
export default class PatientSelect extends React.Component {
  state = { showID: false, patients: this.props.patients };

  filter = value => {
    this.setState({
      patients: this.props.patients.filter(
        patient => patient.name.includes(value) || patient.id.includes(value)
      )
    });
  };
  render() {
    return (
      <Container>
        <TitleTab color="#0b999d">Patient</TitleTab>
        <br />
        <SearchBar onChange={value => this.filter(value)} />
        <br />
        <ShowID
          checked={this.state.showID}
          onChange={() => this.setState({ showID: !this.state.showID })}
        >
          <Label
            style={{
              position: "relative",
              transform: "translate(0,0)",
              margin: "0rem 1rem"
            }}
          >
            Show ID
          </Label>
          <Switch checked />
        </ShowID>
        <hr />
        <ScrollBox style={{ width: "100%", height: "44%" }}>
          {this.state.patients.map(patient => (
            <PatientBox
              patientName={patient.name}
              patientID={patient.id}
              showID={this.state.showID}
            />
          ))}
        </ScrollBox>
        <DoneButton onClick={this.props.onDoneClick}>Done</DoneButton>
      </Container>
    );
  }
}
