import React from "react";
import styled from "styled-components";

import WeekDaySection from "./calendarComponents/WeekDaySection";
import ScrollBox from "./calendarComponents/ScrollBox";
import AppointmentSection from "./calendarComponents/AppointmentSection";

const Container = styled.div`
  margin: 3px;
  padding: 0%;
  width: 250px;
  height: 509px;
  overflow: hidden;

`;

class OngoingWeekly extends React.Component {

  constructor(props){
      super(props);
      this.state={
         currentMonday: props.currentMonday,
         notificationNumber: props.notificationNumber,
         appointments: props.anytimeAppointments
      };
  }


  render() {
    return (
      <>
        <Container>
          <WeekDaySection
            notificationNumber={
              this.state.notificationNumber
                ? this.state.notificationNumber
                : "0"
            }
            dayName={"Ongoing"}
          />
          <ScrollBox>
            <AppointmentSection
              type="Appointments"
              appointments={this.state.appointments}
            />
            </ScrollBox>
        </Container>
      </>
    );
  }
}

export default OngoingWeekly;
