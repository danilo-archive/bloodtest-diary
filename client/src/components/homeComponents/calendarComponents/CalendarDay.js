/**
 * This component represents a single calendar day in the dashboard.
 * There are 5 calendar days, each one representing a day in the week
 * 
 * This component is a DROP TARGET, AppointmentBoxes can be dropped on this compoenent.
 * @module CalendarDay
 * @author Alvaro Rausell, Jacopo Madaluni
 * @version 0.0.2
 */


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
  height: calc(100% - 15px);
  background-color: white;
  padding: 0;
  position: relative;
  border: solid 1px rgb(131, 149, 149, 0.2);
  min-width: 15rem;
  overflow: hidden;
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

// ----------------------------- DRAG & DROP CONFIGURATIONS ------------------------------
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    hightlighted: monitor.canDrop(),
    item: monitor.getItem()
  };
}

const spec = {
  drop: function(props, monitor, component) {
    return { newDate: props.date };
  },
  hover: function(props, monitor, component) {}
};
// ----------------------------------------------------------

class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { connectDropTarget, hovered } = this.props;
    const backgroundColor = hovered ? "#dbfffc" : "white";
    return connectDropTarget(
      <div style={{ height: "inherit" }}>
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
          <ScrollBox style={{ background: backgroundColor }}>
            <AppointmentSection
              type="Anytime today"
              appointments={this.props.anytimeAppointments}
              editTest={this.props.editTest}
              editPatient={this.props.editPatient}
              handleError={this.props.handleError}
              section={"calendar"}
            />
            <div style={{ width: "100%", height: "130px" }} />
          </ScrollBox>
        </CalendarContainer>
      </div>
    );
  }
}

export default DropTarget("appointment", spec, collect)(CalendarDay);
//
