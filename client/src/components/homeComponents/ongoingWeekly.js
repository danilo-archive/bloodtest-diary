import React from "react";
import styled from "styled-components";

import WeekDaySection from "./calendarComponents/WeekDaySection";
import ScrollBox from "./calendarComponents/ScrollBox";
import AppointmentSection from "./calendarComponents/AppointmentSection";
import { DropTarget } from "react-dnd";

const Container = styled.div`
  margin: 3px;
  padding: 0%;
  width: auto;
  height: 100%;
  overflow: hidden;
  background: ${props => props.background ? props.background : "white"};
`;

function collect(connect, monitor){
  console.log(monitor.isOver());
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    hightlighted: monitor.canDrop(),
    item: monitor.getItem()
  }
}

const spec = {
  drop: function(props, monitor, component){
    return {newDate: props.date}
  },
  hover: function(props, monitor, component){
  }
}

class OngoingWeekly extends React.Component {

  constructor(props){
      super(props);
  }


  render() {
    const { connectDropTarget, hovered, item} = this.props;
    const backgroundColor = hovered ? "#dbfffc" : "white";
    return connectDropTarget(
      <div style={{background: backgroundColor}}>
        <Container background={backgroundColor}>
          <WeekDaySection
            notificationNumber={
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "0"
            }
            dayName={"This Week"}
          />
          <ScrollBox style={{background: backgroundColor}}>
            <AppointmentSection
              background = {backgroundColor}
              type="Appointments"
              appointments={this.props.anytimeAppointments}
              editTest={this.props.editTest}
            />
            <div style={{background: backgroundColor, width:"100%",height:"45px"}}/>
            </ScrollBox>
        </Container>
      </div>
    );
  }
}

export default DropTarget("appointment", spec, collect)(OngoingWeekly);
