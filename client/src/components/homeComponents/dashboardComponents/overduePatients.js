import React from "react";
import styled from "styled-components";

import WeekDaySection from "./calendarComponents/WeekDaySection";
import ScrollBox from "./calendarComponents/ScrollBox";
import AppointmentSection from "./calendarComponents/AppointmentSection";

const Container = styled.div`
margin: 3px;
padding: 0%;
width: 250px;
height: 100%;
overflow: hidden;
`;

class OverduePatients extends React.Component {
  render() {
    return (
      <>
        <Container>
          <WeekDaySection
            notificationNumber={
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "1"
            }
            dayName={"Overdue"}
          />
          <ScrollBox>
            <AppointmentSection
              type="Appointments"
              appointments={this.props.anytimeAppointments}
            />
            </ScrollBox>
        </Container>
      </>
    );
  }
}

export default OverduePatients;
