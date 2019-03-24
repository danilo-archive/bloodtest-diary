import React from "react";
import styled from "styled-components";

import SearchBar from "./SearchBar";
import TitleTab from "./TitleTab";
import Label from "../../Label";
import Switch from "../../switch/Switch";
import PatientBox from "./PatientBox";
import ScrollBox from "../calendarComponents/ScrollBox";
import { WaveLoading } from "styled-spinkit";

const Container = styled.div`
  height: 100%;
  width: 49.8%;
  border-left: #f5f5f5f5 1px solid;
  background: white;
  float: right;
`;
const ShowID = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;
`;

const ShowIdWrap = styled.div`
  width: 50%;
  margin-left: 25%;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
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
  margin: 4%;

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
  margin: 4%;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
`;

const Hr = styled.hr`
  border: 0;
  margin-left: 5%;
  clear: both;
  display: block;
  width: 90%;               
  background-color: #839595;
  height: 1px;
`;

export default class PatientSelect extends React.Component {
  state = {
    showID: true,
    patients: this.props.patients.slice(0, 30),
    selectedPatientID: "",
    update: false
  };

  filter = value => {
    this.setState({
      patients: this.props.patients
        .filter(
          patient => patient.name.includes(value) || patient.id.includes(value)
        )
        .slice(0, 30)
    });
  };
  render() {
    if (!this.state.updated && this.props.patients) {
      this.setState({
        updated: true,
        patients: this.props.patients.slice(0, 30)
      });
    }
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
            <ShowIdWrap>
              <Label
                style={{
                  transform: "translate(0,0)",
                  margin: "0rem 1rem",
                  color: "black"
                }}
              >
                Hide ID
              </Label>
              <Switch
                  margin={"0 0 0 50%"}
                  checked="checked" />
            </ShowIdWrap>
        </ShowID>
        <Hr />
        <ScrollBox
          style={{
            width: "100%",
            height: "44%"
          }}
        >
          <br />
          {this.props.patients && this.state.updated ? (
            <>
              {this.state.patients.map(patient => (
                <PatientBox
                  key={patient.id}
                  patientName={patient.name}
                  patientID={patient.id}
                  showID={this.state.showID}
                  selected={this.state.selectedPatientID === patient.id}
                  onSelectClick={id => {
                    this.setState({ selectedPatientID: id });
                    this.props.onSelectClick(id);
                  }}
                />
              ))}
              <div style={{ textAlign: "center", opacity: "0.4" }}>
                To see more patients, use the search functionality
              </div>
            </>
          ) : (
            <div
              style={{
                width: "100%",

                textAlign: "center"
              }}
            >
              <WaveLoading />
              <Label
                style={{
                  position: "relative",
                  transform: "translate(0,0)",
                  margin: "auto"
                }}
              >
                Fetching Patients
              </Label>
            </div>
          )}
        </ScrollBox>
          <ButtonContainer>
              <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
              <AddButton onClick={this.props.onDoneClick}>Add test</AddButton>
          </ButtonContainer>
      </Container>
    );
  }
}
