import React from "react";
import styled from "styled-components";

import AppointmentSectionHeader from "./AppointmentSectionHeader";
import AppointmentBox from "./AppointmentBox";

const AppointmentSection = styled.div`
  text-align: center;
  position: relative;
`;

export default props => {
  return (
    <AppointmentSection>
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
