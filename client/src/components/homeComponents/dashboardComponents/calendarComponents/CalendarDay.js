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
  width: 250px;
  height: 500px;
  background-color: white;
  padding: 0;
  position: relative;
  border: solid 1px #646464;


`;

class CalendarDay extends React.Component {
  render() {
    return (
      <>
        <CalendarContainer>
          <WeekDaySection
            notificationNumber={
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "1"
            }
            dayName={this.props.dayName || "Monday"}
          />
          <MonthDaySection
            dayNumber={this.props.dayNumber ? this.props.dayNumber : "01"}
            monthName={this.props.monthName || "June"}
          />
          <ScrollBox>
            <AppointmentSection
              type="Anytime Today"
              appointments={this.props.anytimeAppointments}
            />
            <AppointmentSection
              type="Scheduled Appointments"
              appointments={this.props.scheduledAppointments}
            />
          </ScrollBox>
        </CalendarContainer>
      </>
    );
  }
}

export default CalendarDay;
