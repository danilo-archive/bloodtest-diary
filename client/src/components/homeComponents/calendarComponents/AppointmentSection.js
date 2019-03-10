import React from "react";
import styled from "styled-components";

import AppointmentSectionHeader from "./AppointmentSectionHeader";
import AppointmentBox from "./AppointmentBox";
import VerticalLine from "./VerticalLine";

const AppointmentSection = styled.div`
  text-align: center;
  position: relative;
  padding: 0;
  width: inherit;
`;

function formatOverdueTitle(header){
  let tokens = header.split(" ");
  if (tokens.length > 5){
    return `Week Beg ${tokens[3]}-${tokens[2]}-${tokens[1]}`
  } else {
    return header;
  }
}

export default props => {
  const header = formatOverdueTitle(props.type);
  return (
    <AppointmentSection>
      <VerticalLine />
      <AppointmentSectionHeader color={props.color}>{header}</AppointmentSectionHeader>
      {props.appointments.map(appointment => (
        <AppointmentBox
          id = {appointment.test_id}
          type={appointment.completed_status}
          name={`${appointment.patient_name} ${appointment.patient_surname}`}
          time={appointment.time}
          dueDate={appointment.due_date}
          editTest={props.editTest}
        />
      ))}
    </AppointmentSection>
  );
};
