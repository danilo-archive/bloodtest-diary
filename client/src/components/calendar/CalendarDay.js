import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";
import MonthDaySection from "./MonthDaySection";
import ScrollBox from "./ScrollBox";
import AppointmentSection from "./AppointmentSection";

const APPOINTMENTS_EXAMPLE = [
  {
    status: "pending",
    patientName: "Luka Kralj"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell",
    time: "12:00"
  },
  {
    status: "late",
    patientName: "Danilo del Busso"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini"
  },
  {
    status: "pending",
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
  position: relative;
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
              appointments={APPOINTMENTS_EXAMPLE}
            />
          </ScrollBox>
        </CalendarContainer>
      </>
    );
  }
}

export default CalendarDay;
