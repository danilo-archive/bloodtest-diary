import React, { Component } from 'react';
import styled from 'styled-components';

let openAlertFunction;

const Container = styled.div`
.alert-enter {
  left: -600px;
  }
.alert-enter.alert-enter-active {
  left: 0;
  transition: left 300ms ease-in;
}
.alert-exit {
  opacity: 1;
}
.alert-exit.alert-exit-active {
  opacity: 0.01;
  transition: opacity 200ms ease-in;
}
`

const StyledAlert = styled.div`
  width: 400px;
  height: 200px;

  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);

  margin: 50px;
  z-index: 1000;
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

export default class Alert extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      type: '',
      message: '',
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
      type: '',
    })
  };

  closeAlert() {
    this.setState({
      open:false,
      message: '',
      type: '',
    })
  }


  render() {
    const { open } = this.state;
    return (
      <>
        {open ?
          <Container>

              <StyledAlert>{this.state.message}

                <div className={"confirmationButton"} onClick={this.closeAlert}>Ok</div>
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
