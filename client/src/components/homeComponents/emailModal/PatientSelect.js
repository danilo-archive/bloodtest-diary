import React from "react";
import styled from "styled-components";

import SearchBar from "./SearchBar";
import TitleTab from "./TitleTab";
import Label from "../../Label";
import Switch from "../../switch/Switch";
import PatientBox from "./PatientBox";
import ScrollBox from "../calendarComponents/ScrollBox";
import { WaveLoading } from "styled-spinkit";
import Button from "../editTest/Button";
import dateformat from "dateformat";
import TextRadioButton from "../editTest/TextRadioButton";
const Container = styled.div`
  position: relative;
  top: -20px;
  ${props => (props.direction === "left" ? "left: -0px;" : "")}
  height: 75%;
  width: 49.8%;
  background: rgba(244, 244, 244, 0.7);
  float: ${props => props.direction};
  ${props =>
    props.direction === "right" ? "border-left: solid 1px grey;" : ""};
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
  state = {
    showID: true,
    patients: this.props.patients.slice(0, 30),
    selectedPatientIDs: [],
    update: false
  };

  filter = value => {
    this.setState({
      patients: this.props.patients
        .filter(
          patient =>
            patient.name.includes(value) ||
            patient.id.toString().includes(value) ||
            dateformat(new Date(patient.dueDate), "d mmm yyyy").includes(value)
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
      <Container direction={this.props.direction}>
        <TitleTab color="#0b999d">
          {this.props.notified ? "Already Notified" : "Not Notified"}
        </TitleTab>
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
              margin: "0rem 1rem",
              color: "rgba(0,0,0,0.7)"
            }}
          >
            Show Additional Info
          </Label>
          <Switch checked="checked" />
        </ShowID>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TextRadioButton
            text="Select All"
            checked={this.props.patients.every(patient =>
              this.props.selected.find(p => p.id === patient.id)
            )}
            onCheck={checked => {
              if (checked) {
                this.setState({
                  selectedPatientIDs: this.props.patients.map(
                    patient => patient.id
                  )
                });
              } else {
                this.setState({
                  selectedPatientIDs: []
                });
              }
              this.props.selectAll(this.props.notified, checked);
            }}
          />
        </div>
        <hr />
        <ScrollBox
          style={{
            width: "100%",
            height: "50%"
          }}
        >
          <br />
          {this.props.patients && this.state.updated ? (
            <>
              {this.state.patients.map(patient => (
                <PatientBox
                  key={patient.id}
                  patientName={patient.name}
                  lastReminder={patient.lastReminder}
                  patientID={patient.id}
                  dueDate={patient.dueDate}
                  showID={this.state.showID}
                  selected={this.state.selectedPatientIDs.includes(patient.id)}
                  onSelectClick={id => {
                    this.setState({
                      selectedPatientIDs: this.state.selectedPatientIDs.includes(
                        patient.id
                      )
                        ? this.state.selectedPatientIDs.filter(
                            pid => pid !== id
                          )
                        : [...this.state.selectedPatientIDs, id]
                    });
                    this.props.onSelectClick(
                      id,
                      this.state.selectedPatientIDs.includes(patient.id)
                    );
                  }}
                />
              ))}
              <div
                style={{
                  textAlign: "center",
                  opacity: "0.4",
                  fontSize: "110%"
                }}
              >
                To see more patients, please use the search functionality
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
      </Container>
    );
  }
}
