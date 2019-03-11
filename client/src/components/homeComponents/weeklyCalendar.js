import React from "react";
import styled from "styled-components";
import CalendarDay from "./calendarComponents/CalendarDay";

const WeekContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;


  width: auto;
  height: 100%;

  overflow-x: scroll;
  overflow-y: hidden;
`;

class WeeklyCalendar extends React.Component {

  constructor(props){
      super(props);
  }



  render() {
      return (
        <WeekContainer>
          <CalendarDay
            notificationNumber={
              this.props.calendar[0].length
            }
            date= {this.props.weekDays[0]}
            dayName = {"Monday"}
            anytimeAppointments={this.props.calendar[0]}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
          />
          <CalendarDay
            notificationNumber={
             this.props.calendar[1].length
            }
            date=  {this.props.weekDays[1]}
            dayName = {"Tuesday"}
            anytimeAppointments={this.props.calendar[1]}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
          />
          <CalendarDay
            notificationNumber={
              this.props.calendar[2].length
            }
            date= {this.props.weekDays[2]}
            dayName = {"Wednesday"}
            anytimeAppointments={this.props.calendar[2]}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
          />
          <CalendarDay
            notificationNumber={
              this.props.calendar[3].length
            }
            date= {this.props.weekDays[3]}
            dayName = {"Thursday"}
            anytimeAppointments={this.props.calendar[3]}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
          />
          <CalendarDay
            notificationNumber={
              this.props.calendar[4].length
            }
            date= {this.props.weekDays[4]}
            dayName = {"Friday"}
            anytimeAppointments={this.props.calendar[4]}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
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
