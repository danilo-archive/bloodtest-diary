import React, { Component } from 'react';
import styled from 'styled-components';

import ConfirmationAlert from "./alertComponents/confirmationAlert"
import DialogAlert from "./alertComponents/dialogAlert"
import OptionAlert from "./alertComponents/optionAlert"

let openAlertFunction;

const Container = styled.div`
  position: absolute;
  z-index: 1001; //to make it higher than modals
  height: 100vh;
  width: 100vw;
  background-color: rgb(0, 0, 0, 0.3);
`;

const StyledAlert = styled.div`
  min-width: 290px;
  width: auto;
  max-width: 500px;
  height: 160px;

  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);

  margin: 50px;
  z-index: 50;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

  overflow: hidden;
`;


export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: '',
      type: '',
      option1Text: '',
      option1Callback: undefined,
      option2Text: '',
      option2Callback: undefined,
    };
    this.closeAlert = this.closeAlert.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }

  componentDidMount() {
    openAlertFunction = this.openAlert;
  }

  openAlert({ message, type, option1Text, option1Callback,  option2Text, option2Callback }) {
    this.setState({
      open: true,
      message: message,
      type: type,
      option1Text: option1Text,
      option1Callback: option1Callback,
      option2Text: option2Text,
      option2Callback: option2Callback,
    })
  };

  closeAlert() {
    this.setState({
      open: false,
      message: '',
      type: '',
      option1Text: '',
      option1Callback: undefined,
      option2Text: '',
      option2Callback: undefined,
    })
  }

  getAlert() {
      switch(this.state.type) {
        case 'dialogAlert':
          return (
            <DialogAlert
              message = {this.state.message}
              closeAlert = {this.closeAlert}
            />
          );
        case 'confirmationAlert':
          return (
            <ConfirmationAlert
              message = {this.state.message}
              option1Text = {this.state.option1Text}
              option1Callback = {this.state.option1Callback}
              closeAlert = {this.closeAlert}
            />
          );
        case 'optionAlert':
          return (
            <OptionAlert
              message = {this.state.message}
              option1Text = {this.state.option1Text}
              option1Callback = {this.state.option1Callback}
              option2Text = {this.state.option2Text}
              option2Callback = {this.state.option2Callback}
              closeAlert = {this.closeAlert}
            />
          );
        default:
          return null;
      }
  }

  render() {
    const content = this.getAlert();
    return (
      <>
        {this.state.open ?
          <Container>
            <StyledAlert>
              {content}
            </StyledAlert>
          </Container>
        : null}
      </>
    )
  }
}

export function openAlert(message, type, option1Text, option1Callback,  option2Text, option2Callback) {
  openAlertFunction({ message, type, option1Text, option1Callback,  option2Text, option2Callback })
}
