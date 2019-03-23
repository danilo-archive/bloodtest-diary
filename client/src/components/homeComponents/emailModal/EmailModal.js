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
  height: ${props => (!props.fullLength ? `27%` : `66%`)};
  border: 1px solid #b0b0b0b0;
`;
export default class EmailModal extends Component {
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.state = {
      selected: [],
      response: {},
      submitted: false,
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
          patientName: `${patient.patient_name} ${patient.patient_surname}`,
          lastReminder: patient.last_reminder
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
      console.log(res);
      if (res.success) {
        openAlert(
          "All selected patients contacted successfully.",
          "confirmationAlert",
          "OK",
          () => {
            this.props.closeModal();
          }
        );
      } else {
        this.setState({
          failedMails: Object.keys(res.response)
            .map(type => {
              return res.response[type].length;
            })
            .reduce((a, b) => a + b),
          response: res.response,
          submitted: true
        });
        this.props.handleError(res, "Something went wrong.");
      }
    });
  };

  render() {
    return (
      <Container>
        <Title>Email reminders</Title>
        {this.state.submitted ? (
          <>
            <TestBox
              noCheck
              stat={`${this.state.failedMails}/${this.state.selected.length}`}
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
              text="Emails sent"
            />
            <Scroll fullLength={this.state.notified.length === 0}>
              <Section
                awaitResponse={true}
                response={this.state.response}
                submitted={this.state.submitted}
                selected={this.state.selected}
                tests={this.state.selected}
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
        {this.state.notNotified.length !== 0 && !this.state.submitted ? (
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
              text="No reminders sent"
            />
            <Scroll fullLength={this.state.notified.length === 0}>
              <Section
                submitted={this.state.submitted}
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
        {this.state.notified.length !== 0 && !this.state.submitted ? (
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
              text="Recently notified"
            />
            <Scroll fullLength={this.state.notNotified.length === 0}>
              <Section
                submitted={this.state.submitted}
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
