import React from "react";
import styled from "styled-components";

import WeekDaySection from "./calendarComponents/WeekDaySection";
import ScrollBox from "./calendarComponents/ScrollBox";
import AppointmentSection from "./calendarComponents/AppointmentSection";

const Container = styled.div`
margin: 3px;
padding: 0%;
width: auto;
height: 100%;
overflow: hidden;
`;

class OverduePatients extends React.Component {

  constructor(props){
      super(props);
      this.state={
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
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "0"
            }
            dayName={"Outstanding"}
          />
          <ScrollBox>
              {this.props.anytimeAppointments.map( group => {
                  if(group.tests.length !== 0){
                      return (
                          <AppointmentSection
                              type = {group.class}
                              color = {"#ffe266"}
                              appointments = {group.tests}
                          />
                      )
                }
            })}
            <div style={{width:"100%",height:"10%"}}/>
          </ScrollBox>
        </Container>
      </>
    );
  }
}
export default OverduePatients;
