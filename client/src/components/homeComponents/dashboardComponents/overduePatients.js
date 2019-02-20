import React from "react";
import styled from "styled-components";

import WeekDaySection from "./calendarComponents/WeekDaySection";
import ScrollBox from "./calendarComponents/ScrollBox";
import AppointmentSection from "./calendarComponents/AppointmentSection";

const CalendarContainer = styled.div`
  margin: 0.2%;
  padding: 0%;
  width: 300px;
  height: 600px;
  background-color: white;
  padding: 0;
  position: relative;
  border: solid 1px #646464;
`;

class OverduePatients extends React.Component {
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
            dayName={"Overdue"}
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

export default OverduePatients;
