import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";
import MonthDaySection from "./MonthDaySection";
import ScrollBox from "./ScrollBox";
import AppointmentSection from "./AppointmentSection";

const CalendarContainer = styled.div`
  margin: 3px;
  margin-bottom: 5px;
  padding: 0%;
  width: 16vw;
  height: calc(100% - 15px);
  background-color: white;
  padding: 0;
  position: relative;
  border: solid 1px rgb(131,149,149, 0.2);
  min-width: 15rem;
  overflow : hidden;
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

class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
    /* this.state = {
        notificationNumber: props.notificationNumber,
        date: props.date,
        dayName: props.dayName,
        appointments: props.anytimeAppointments
    };*/
  }

  render() {
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
              type="Anytime Today"
              appointments={this.props.anytimeAppointments}
            />
            <div style={{width:"100%",height:"130px"}}/>
          </ScrollBox>
        </CalendarContainer>
      </>
    );
  }
}

export default CalendarDay;
