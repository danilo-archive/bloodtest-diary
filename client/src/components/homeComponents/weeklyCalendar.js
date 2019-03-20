import React from "react";
import styled from "styled-components";
import CalendarDay from "./calendarComponents/CalendarDay";

const Container = styled.div`
    
  border: #839595 0px solid;

  background-color: white;

  padding: 0.5%;
  margin-right: 0.5%;

  width: 200px;
  overflow: hidden;
  flex-grow: 10;
  flex-shrink: 1;

  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

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
        <Container>
        <WeekContainer>
          <CalendarDay
            notificationNumber={
              this.props.calendar[0].length
            }
            date= {this.props.weekDays[0]}
            dayName = {"Monday"}
            anytimeAppointments={this.props.calendar[0]}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
            handleError={this.props.handleError}
          />
          <CalendarDay
            notificationNumber={
             this.props.calendar[1].length
            }
            date=  {this.props.weekDays[1]}
            dayName = {"Tuesday"}
            anytimeAppointments={this.props.calendar[1]}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
            handleError={this.props.handleError}
          />
          <CalendarDay
            notificationNumber={
              this.props.calendar[2].length
            }
            date= {this.props.weekDays[2]}
            dayName = {"Wednesday"}
            anytimeAppointments={this.props.calendar[2]}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
            handleError={this.props.handleError}
          />
          <CalendarDay
            notificationNumber={
              this.props.calendar[3].length
            }
            date= {this.props.weekDays[3]}
            dayName = {"Thursday"}
            anytimeAppointments={this.props.calendar[3]}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
            handleError={this.props.handleError}
          />
          <CalendarDay
            notificationNumber={
              this.props.calendar[4].length
            }
            date= {this.props.weekDays[4]}
            dayName = {"Friday"}
            anytimeAppointments={this.props.calendar[4]}
            openModal={this.props.openModal}
            editTest={this.props.editTest}
            handleError={this.props.handleError}
          />


        </WeekContainer>
      </Container>  
    );
  }
}

export default WeeklyCalendar;
