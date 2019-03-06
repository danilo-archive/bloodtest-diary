import React from "react";
import styled from "styled-components";

import AppointmentSectionHeader from "./AppointmentSectionHeader";
import AppointmentBox from "./AppointmentBox";
import VerticalLine from "./VerticalLine";
import { DropTarget } from "react-dnd";

const AppointmentSection = styled.div`
  text-align: center;
  position: relative;
  padding: 0;
  width: inherit;
  background: ${props => props.background};
`;


export default props => {
  return (
      <AppointmentSection background = {props.background}>
        <VerticalLine />
        <AppointmentSectionHeader>{props.type}</AppointmentSectionHeader>
        {props.appointments.map(appointment => (
          <AppointmentBox
            id = {appointment.test_id}
            type={appointment.completed_status}
            name={`${appointment.patient_name} ${appointment.patient_surname}`}
            time={appointment.time}
            dueDate={appointment.due_date}
            editTest={props.editTest}
            section={props.section}
          />
        ))}
      </AppointmentSection>
  );
}
