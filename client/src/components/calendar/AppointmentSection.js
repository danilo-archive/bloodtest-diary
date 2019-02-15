import React from "react";
import styled from "styled-components";

import AppointmentSectionHeader from "./AppointmentSectionHeader";
import AppointmentBox from "./AppointmentBox";
import VerticalLine from "./VerticalLine";

const AppointmentSection = styled.div`
  text-align: center;
  position: relative;
  padding: 0;
`;

export default props => {
  return (
    <AppointmentSection>
      <VerticalLine />
      <AppointmentSectionHeader>{props.type}</AppointmentSectionHeader>
      {props.appointments.map(appointment => (
        <AppointmentBox
          type={appointment.status}
          name={appointment.patientName}
        />
      ))}
    </AppointmentSection>
  );
};
