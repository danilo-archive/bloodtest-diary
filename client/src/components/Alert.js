import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import OfflineScreen from "./OfflineScreen.js";

let openAlertFunction;

const Container = styled.div`
  position: absolute;
  z-index: 49;
  height: 100vh;
  width: 100vw;
  background-color: rgb(0, 0, 0, 0.3);
`

const StyledAlert = styled.div`
  width: 400px;
  height: 200px;

  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);

  margin: 50px;
  z-index: 50;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

  display: flex;
  flex-direction: column;
  justify-content: center;


  .confirmationButton {
    border: solid 0px #97a9a9;
    background-color: red;
    width: 166px;
    height: 31px;
    border-radius:  0;
    cursor: pointer;
    outline:none;
    align-self: flex-end;
  }
`;

const DialogAlert = styled.div`

`;
const ConfirmationAlert = styled.div`

`;
const OptionAlert = styled.div`

`;

export default class Alert extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      message: '',
      type: '',
    }
    this.closeAlert = this.closeAlert.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }

  componentDidMount() {
    openAlertFunction = this.openAlert;
  }

  openAlert({ message, type }) {
    this.setState({
      open:true,
      message: message,
      type: type,
    })
  };

  closeAlert() {
    this.setState({
      open:false,
      message: '',
      type: '',
    })
  }

  getAlert() {
      switch(this.state.type) {
        case 'dialogAlert':
          return (

            <DialogAlert>{this.state.message}
              <div className={"confirmationButton"} onClick={this.closeAlert}>Ok</div>
            </DialogAlert>

          );
        case 'confirmationAlert':

          return (

            <ConfirmationAlert>{this.state.message}
              <div className={"confirmationButton"} onClick={this.closeAlert}>Ok</div>
            </ConfirmationAlert>

          );
        case 'optionAlert':
          return (

            <OptionAlert>{this.state.message}
              <div className={"confirmationButton"} onClick={this.closeAlert}>Ok</div>
            </OptionAlert>

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

export function openAlert({ message, type }) {
  openAlertFunction({ message, type})
}

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['dialogAlert', 'confirmationAlert', 'optionAlert'])
}
