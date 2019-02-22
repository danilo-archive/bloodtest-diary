import React from "react";
import styled from "styled-components";
import CalendarDay from "./calendarComponents/CalendarDay";

const WeekContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start
  overflow-x: scroll;
  overflow-y: hidden;
`;

class WeeklyCalendar extends React.Component {

  constructor(props){
      super(props);
      let calendar = props.calendar;
      this.state = {
         mondayDate: this.props.mondayDate,
         monday: calendar[0],
         tuesday: calendar[1],
         wednesday: calendar[2],
         thursday: calendar[3],
         friday: calendar[4]
      };



  }



  render() {
      let tuesdayDate = new Date();
      tuesdayDate.setDate(this.state.mondayDate.getDate() + 1);
      let wednesdayDate = new Date();
      wednesdayDate.setDate(this.state.mondayDate.getDate() + 2);
      let thursdayDate = new Date();
      thursdayDate.setDate(this.state.mondayDate.getDate() + 3);
      let fridayDate = new Date();
      fridayDate.setDate(this.state.mondayDate.getDate() + 4);
      return (
        <WeekContainer>
          <CalendarDay
            notificationNumber={
              this.state.monday.length
            }
            date= {this.state.mondayDate}
            dayName = {"Monday"}
            anytimeAppointments={this.state.monday}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
          />
          <CalendarDay
            notificationNumber={
              this.state.tuesday.length
            }
            date=  {tuesdayDate}
            dayName = {"Tuesday"}
            anytimeAppointments={this.state.tuesday}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
          />
          <CalendarDay
            notificationNumber={
              this.state.wednesday.length
            }
            date= {wednesdayDate}
            dayName = {"Wednesday"}
            anytimeAppointments={this.state.wednesday}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
          />
          <CalendarDay
            notificationNumber={
              this.state.thursday.length
            }
            date= {thursdayDate}
            dayName = {"Thursday"}
            anytimeAppointments={this.state.thursday}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
          />
          <CalendarDay
            notificationNumber={
              this.state.friday.length
            }
            date= {fridayDate}
            dayName = {"Friday"}
            anytimeAppointments={this.state.friday}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
          />


        </WeekContainer>
    );
  }
}

export default WeeklyCalendar;

const APPOINTMENTS_EXAMPLE_ANYTIME = [
  {
    status: "completed",
    patientName: "Luka Kralj"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell"
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

const APPOINTMENTS_EXAMPLE_SCHEDULED = [
  {
    status: "pending",
    patientName: "Luka Kralj",
    time: "09:00"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell",
    time: "12:00"
  },
  {
    status: "late",
    patientName: "Danilo del Busso",
    time: "13:00"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini",
    time: "15:00"
  },
  {
    status: "pending",
    patientName: "Just A Very Long Name To Test This",
    time: "23:30"
  }
];
