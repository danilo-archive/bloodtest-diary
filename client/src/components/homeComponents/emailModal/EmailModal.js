import React, { Component } from "react";
import styled from "styled-components";
import Section from "./Section";
import Title from "./Title";
import ScrollBox from "../calendarComponents/ScrollBox";
import TestBox from "./TestBox";
import SubmitButton from "./SubmitButton";
import { inherits } from "util";
import { openAlert } from "./../../Alert.js";
import { getServerConnect } from "./../../../serverConnection.js";
const Container = styled.div`
  position: relative;
  height: 592px;
  width: 635px;
  background: white;
`;

const Scroll = styled(ScrollBox)`
  height: ${props => (!props.fullLength ? `33%` : `66%`)};
  border: 1px solid #b0b0b0b0;
`;
export default class EmailModal extends Component {
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.state = {
      selected: [],
      notNotified: props.notNotified.map(patient => {
        return {
          testId: patient.test_id,
          dueDate: patient.due_date,
          patientName: `${patient.patient_name} ${patient.patient_surname}`
        };
      }),
      notified: props.notified.map(patient => {
        return {
          testId: patient.test_id,
          dueDate: patient.due_date,
          patientName: `${patient.patient_name} ${patient.patient_surname}`
        };
      })
    };
  }

  select = users => {
    if (users instanceof Array) {
      this.setState({
        selected: [
          ...this.state.selected.filter(
            user => !users.find(patient => patient.testId === user.testId)
          ),
          ...users
        ]
      });
    } else {
      this.setState({ selected: [...this.state.selected, users] });
    }
  };
  deselect = users => {
    if (users instanceof Array) {
      this.setState({
        selected: this.state.selected.filter(
          patient => !users.find(user => user.testId === patient.testId)
        )
      });
    } else {
      this.setState({
        selected: this.state.selected.filter(
          patient => users.testId !== patient.testId
        )
      });
    }
  };
  areAllIncluded(array1, array2) {
    let count = 0;
    array1.map(test => {
      array2.find(test2 => test.testId === test2.testId)
        ? (count += 1)
        : (count += 0);
    });

    return count === array2.length;
  }

  submit = () => {
    let idList = this.state.selected.map(patient => patient.testId);
    this.serverConnect.sendReminders(idList, res => {
      if (res.success) {
        openAlert(
          "Patients contacted successfully",
          "confirmationAlert",
          "Ok",
          () => {
            this.props.closeModal();
          }
        );
      } else {
        this.props.handleError(res, "Something went wrong");
      }
    });
  };

  render() {
    return (
      <Container>
        <Title>Email Reminders</Title>
        {this.state.notNotified.length !== 0 ? (
          <>
            <TestBox
              selected={this.areAllIncluded(
                this.state.selected,
                this.state.notNotified
              )}
              onAllCheck={check =>
                check
                  ? this.select(this.state.notNotified)
                  : this.deselect(this.state.notNotified)
              }
              title={true}
              text="Not yet notified"
            />
            <Scroll fullLength={this.state.notified.length === 0}>
              <Section
                selected={this.state.selected}
                tests={this.state.notNotified}
                select={(check, patient) =>
                  check ? this.select(patient) : this.deselect(patient)
                }
              />
            </Scroll>
            <br />
          </>
        ) : (
          ``
        )}
        {this.state.notified.length !== 0 ? (
          <>
            <TestBox
              selected={this.areAllIncluded(
                this.state.selected,
                this.state.notified
              )}
              onAllCheck={check =>
                check
                  ? this.select(this.state.notified)
                  : this.deselect(this.state.notified)
              }
              title={true}
              text="Already Notified"
            />
            <Scroll fullLength={this.state.notNotified.length === 0}>
              <Section
                select={(check, patient) =>
                  check ? this.select(patient) : this.deselect(patient)
                }
                selected={this.state.selected}
                tests={this.state.notified}
              />
            </Scroll>
          </>
        ) : (
          ``
        )}

        <SubmitButton onClick={this.submit} />
      </Container>
    );
  }
}
