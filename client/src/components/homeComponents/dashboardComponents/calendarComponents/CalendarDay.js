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
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

class CalendarDay extends React.Component {

  constructor(props){
      super(props);
      this.state = {
        notificationNumber: props.notificationNumber,
        date: props.date,
        dayName: props.dayName,
        appointments: props.anytimeAppointments
      };
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
            dayNumber={this.props.date.getDate()}
            monthName={monthNames[this.props.date.getMonth()]}
          />
          <ScrollBox>
            <AppointmentSection
              type="Anytime Today"
              appointments={this.props.anytimeAppointments}
            />
          </ScrollBox>
        </CalendarContainer>
      </>
    );
  }
}

export default CalendarDay;
