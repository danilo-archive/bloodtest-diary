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
            openModal={this.props.openModal}
            section="calender"
            editTest={this.props.editTest}
          />
          <CalendarDay
            notificationNumber={
             this.props.calendar[1].length
            }
            date=  {this.props.weekDays[1]}
            dayName = {"Tuesday"}
            anytimeAppointments={this.props.calendar[1]}
            section="calender"
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
            section="calender"
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
            section="calender"
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
            section="calender"
            openModal={this.props.openModal}
            editTest={this.props.editTest}
          />


        </WeekContainer>
    );
  }
}

export default WeeklyCalendar;
