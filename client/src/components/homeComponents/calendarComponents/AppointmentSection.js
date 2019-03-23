import React from "react";
import styled from "styled-components";

import AppointmentSectionHeader from "./AppointmentSectionHeader";
import AppointmentBox from "./AppointmentBox";
import VerticalLine from "./VerticalLine";
import { DropTarget } from "react-dnd";
import formatDate from "dateformat";

const AppointmentSection = styled.div`
  text-align: center;
  position: relative;
  padding: 0;
  width: auto;
  background: ${props => props.background};
`;

function formatOverdueTitle(section, header){
    if (section !== "overdue"){
        return header;
    }else{
        return `Week beg ${formatDate((new Date(header)), "dS mmm yyyy")}`;
    }
}

export default props => {
  const header = formatOverdueTitle(props.section, props.type);
  const padding = ((props.section === "calendar") ? `8px` : '0px');
  return (
      <AppointmentSection style={{ 'padding-left': padding, 'padding-right': padding}}>
        <AppointmentSectionHeader color={props.color} section={props.section}>{header}</AppointmentSectionHeader>
        <VerticalLine style={{ 'margin-left': padding}}/>
        {props.appointments.map(appointment => (
          <AppointmentBox
            test={appointment}
            key={appointment.test_id}
            id = {appointment.test_id}
            type={appointment.completed_status}
            name={`${appointment.patient_name} ${appointment.patient_surname}`}
            time={appointment.time}
            dueDate={appointment.due_date}
            editTest={props.editTest}
            editPatient={props.editPatient}
            section={props.section}
            handleError={props.handleError}
            patient_colour={appointment.patient_colour}
            test_colour={appointment.test_colour}
            default_colour={appointment.hospital_id ? "white" : "#c4fcff"}
            patient_no = {appointment.patient_no}
          />
        ))}
      </AppointmentSection>
  );
}
