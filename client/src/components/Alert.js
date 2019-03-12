import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faExclamationCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

let openAlertFunction;
let timer;

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
`};

const StyledAlert = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  max-width: 600px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 50px;
  z-index: 1000;
  color: white;
  border-radius: 3px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Open Sans', sans-serif;
  .Alert-message-container {
    display: flex;
    flex-direction: row;
    padding: 20px;
    justify-content: flex-start;
    .icon {
      margin: auto auto;
      font-size: 24px;
    }
  }
  p {
    text-align: left;
    margin: 0;
    padding: 3px 20px;
    font-weight: 500;
  }
`};

export default class Alert extends Component {
  constructor(props) {
    super(props);
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

  closeAlert() {
  this.setState({
    open:false,
    message: '',
    type: '',
  })
}

export function openAlert({ message, type, duration }) {
  openAlertFunction({ message, type, duration });
}
