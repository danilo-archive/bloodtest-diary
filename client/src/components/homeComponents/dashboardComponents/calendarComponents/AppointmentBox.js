import React from "react";
import styled from "styled-components";
import StatusCircle from "./StatusCircle";
import AppointmentInfo from "./AppointmentInfo";
import IconSet from "./IconSet";
import TimePill from "./TimePill";

const Container = styled.div`
  display: block;
  position: relative;
  background-color: white;
  margin-top: 0;
  margin-bottom: 0;
  margin: 5%;
  padding: 0%;
  height: 14%;
  border: solid 1px rgb(100, 100, 100, 0.2);
  display: flex;
  align-items: center;
  z-index: 3;
`;

export default class AppointmentBox extends React.Component {
  state = {
    status: this.props.type,
    time: this.props.time,
    name: this.props.name
  };

  onStatusClick = status => {
    if (this.state.status === "pending") this.setState({ status });
  };

  render() {
    const { status, time, name } = this.state;
    return (
      <Container>
        {time ? <TimePill status={status}>{time}</TimePill> : ``}
        <StatusCircle type={status} />
        <AppointmentInfo name={name} />
        <IconSet onStatusClick={this.onStatusClick} />
      </Container>
    );
  }
}
