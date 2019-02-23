import React from "react";
import styled from "styled-components";
import StatusCircle from "./StatusCircle";
import AppointmentInfo from "./AppointmentInfo";
import IconSet from "./IconSet";
import TimePill from "./TimePill";
import {getServerConnect} from "../../../../serverConnection.js";
const Container = styled.div`
  display: block;
  position: relative;
  background-color: white;
  margin-top: 0;
  margin-bottom: 0;
  margin: 2.5%;
  padding: 0%;
  height: 14%;
  border: solid 1px rgb(100, 100, 100, 0.2);
  display: flex;
  align-items: center;
  z-index: 3;
`;

const mapping = {
    "yes":"completed",
    "no": "late",
    "in review": "pending"
}

export default class AppointmentBox extends React.Component {

  constructor(props){
      super(props);
      this.state = {
        id: this.props.id,
        status: this.props.type,
        time: this.props.time,
        name: this.props.name
      };
      this.serverConnect = getServerConnect();
}

  onStatusClick = status => {
    if (this.state.status === "pending") this.setState({ status });
    //this.serverConnect.changeStatus(this.state.id, status);
  };

  render() {
    const { status, time, name } = this.state;
    return (
      <Container>
        {time ? <TimePill status={status}>{time}</TimePill> : ``}
        <StatusCircle type={mapping[this.props.type]} />
        <AppointmentInfo name={name} />
        <IconSet onStatusClick={this.onStatusClick} />
      </Container>
    );
  }
}
