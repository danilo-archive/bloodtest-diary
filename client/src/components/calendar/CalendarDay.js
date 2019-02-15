import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";
import MonthDaySection from "./MonthDaySection";
import ScrollBox from "./ScrollBox";
import AppointmentSection from "./AppointmentSection";

const APPOINTMENTS_EXAMPLE = [
  {
    type: "pending",
    patientName: "Luka Kralj"
  },
  {
    type: "completed",
    patientName: "Alvaro Rausell"
  },
  {
    type: "late",
    patientName: "Danilo del Busso"
  },
  {
    type: "completed",
    patientName: "Alessandro Amantini"
  },
  {
    type: "pending",
    patientName: "IDK Who Else To Put"
  }
];
const CalendarContainer = styled.div`
  margin: 5%;
  padding: 10%;
  width: 300px;
  height: 495px;
  background-color: white;
  padding: 0;
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
            <AppointmentSection type="Anytime Today" />
            <AppointmentSection
              type="Anytime Today"
              appointments={APPOINTMENTS_EXAMPLE}
            />
          </ScrollBox>
        </CalendarContainer>
      </>
    );
  }
}

export default CalendarDay;
