import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";
import MonthDaySection from "./MonthDaySection";
import ScrollBox from "./ScrollBox";
import AppointmentSection from "./AppointmentSection";
import { DropTarget } from "react-dnd";

const CalendarContainer = styled.div`
  margin: 3px;
  margin-bottom: 5px;
  padding: 0%;
  width: 16vw;
  height: inherit;
  background-color: white;
  padding: 0;
  position: relative;
  border: solid 1px #839595;
  min-width: 17rem;
`;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

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


class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { connectDropTarget, hovered, item} = this.props;
    const backgroundColor = hovered ? "#c0f7ad" : "white";
    return connectDropTarget(
      <div style={{height: "inherit"}}>
        <CalendarContainer>
          <WeekDaySection
            notificationNumber={
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "0"
            }
            dayName={this.props.dayName}
          />
          <MonthDaySection
            date={this.props.date}
            dayNumber={this.props.date.getDate()}
            monthName={monthNames[this.props.date.getMonth()]}
            openModal={date => this.props.openModal(date)}
          />
          <ScrollBox style={{background: backgroundColor}}>
            <AppointmentSection
              background = {backgroundColor}
              type="Anytime Today"
              appointments={this.props.anytimeAppointments}
              sectionDate={this.props.date}
              editTest={this.props.editTest}
            />
            <div style={{width:"100%",height:"30%"}}/>
          </ScrollBox>
        </CalendarContainer>
      </div>
    );
  }
}

export default DropTarget("appointment", spec, collect)(CalendarDay);
// 