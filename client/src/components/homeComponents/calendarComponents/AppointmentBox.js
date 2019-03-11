import React from "react";
import styled from "styled-components";
import StatusCircle from "./StatusCircle";
import AppointmentInfo from "./AppointmentInfo";
import IconSet from "./IconSet";
import TimePill from "./TimePill";
import {getServerConnect} from "../../../serverConnection.js";
import {isPastDate} from "../../../lib/calendar-controller.js";
const Container = styled.div`
  display: block;
  position: relative;
  background-color: ${props => (props.tentative ? `#c1c1c1` : `white`)};

  margin-top: 3.5%;
  margin-bottom: 3.5%;

  padding-top: 5px;
  padding-bottom: 5px;

  height: 35px;
  width: auto;
  border: solid 1px rgb(100, 100, 100, 0);
  border-radius: 3px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  //box-shadow: 0 1px 1px rgba(0,0,0,0.16), 0 1px 1px rgba(0,0,0,0.16);


  z-index: 3;
  & .pill {
    opacity: 0;
    transition: opacity 150ms;
  }
  ${props =>
    props.tentative
      ? ``
      : `&:hover {
        border: solid 1px rgb(100, 100, 100, 0.4);
        font-weight: bold;
    }`}

  ${props =>
    props.tentative
      ? `
      & *{
        background-color: ${props => (props.tentative ? `grey` : `white`)};
        color: white!important;
        transition-property:none;

        &:hover {
          opacity:1 !important;
        }
      }
      &:hover {
        & .pill {
          opacity:1;
        }
      }

        `
      : ``}


      .status {
        margin-left: 7px;
        margin-right: 7px;
      }
      .info {
        flex-grow: 1;
        flex-shrink: 1;
        overflow: scroll;
      }
      .iconsSet {
        margin-left: 7px;
        margin-right: 7px;
      }
`;

const mapping = {
    "yes":"completed",
    "no": "pending",
    "in review": "inReview"
}

export default class AppointmentBox extends React.Component {
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
  }


  formatStatus(status, date){
      if (status === "no" && isPastDate(date)){
          return "late";
      }
      if (status === "completed" || status === "inReview" || status === "late"){
         return status;
     } else {
         return mapping[status];
     }

  }

  onStatusClick = status => {
    this.serverConnect.changeTestStatus(this.props.id, status);
  };

  render() {
    return (
      <Container tentative={this.props.tentative}>
        {this.props.tentative ? <TimePill status={this.props.type}>Tentative</TimePill> : ``}

        <StatusCircle
          type={this.props.tentative ? "tentative" : this.formatStatus(this.props.type,  this.props.dueDate)}
        />
        <AppointmentInfo name={this.props.name} />
        <IconSet
            onStatusClick={this.props.tentative ? () => {} : this.onStatusClick}
            editTest={this.props.editTest}
            testId={this.props.id}
        />
      </Container>
    );
  }
}
