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
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem()
  }
}

const spec = {
  drop: function(props, monitor, component){
    console.log("called");
    return {newDate: props.sectionDate}
  },
  hover: function(props, monitor, component){
    console.log("over mee");
  }
}


class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { connectDropTarget, hovered, item} = this.props;
    const backgroundColor = hovered ? "#c0f7ad" : "white";
    return (
      <>
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
          <ScrollBox>
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
      </>
    );
  }
}

export default DropTarget("appointment", spec, collect)(CalendarDay);
// 