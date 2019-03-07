import React from "react";
import styled from "styled-components";
import StatusCircle from "./StatusCircle";
import AppointmentInfo from "./AppointmentInfo";
import IconSet from "./IconSet";
import TimePill from "./TimePill";
import { getServerConnect } from "../../../serverConnection.js";
const Container = styled.div`
  display: block;
  position: relative;
  background-color: ${props => (props.tentative ? `#c1c1c1` : `white`)};

  margin-top: 3.5%;
  margin-bottom: 3.5%;
  margin-left: ${props => (props.isCalendar ? `2.5%` : `0`)};
  margin-right: ${props => (props.isCalendar ? `2.5%` : `0`)};

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
  yes: "completed",
  no: "late",
  "in review": "pending"
};

export default class AppointmentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      status: this.props.type,
      name: this.props.name,
      tentative: this.props.tentative | false,
     };
    this.serverConnect = getServerConnect();
  }

  formatStatus(status) {
    if (status === "completed" || status === "pending" || status === "late") {
      return status;
    } else {
      return mapping[status];
    }
  }

  onStatusClick = status => {
    this.serverConnect.changeTestStatus(this.state.id, status);
  };

  render() {
    const { status, name, tentative } = this.state;
    return (
      <Container tentative={tentative}>
        {tentative ? <TimePill status={status}>Tentative</TimePill> : ``}
          <StatusCircle
            type={tentative ? "tentative" : this.formatStatus(this.props.type)}
          />
          <AppointmentInfo name={name} />
          <IconSet onStatusClick={tentative ? () => {} : this.onStatusClick} />
      </Container>
    );
  }
}
