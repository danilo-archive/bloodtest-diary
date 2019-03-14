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

  padding-left: ${props => ((props.section === "calender") ? `10px` : '0px')};
  padding-right: ${props => ((props.section === "calender") ? `10px` : '0px')};

  asdasd
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
  console.log(props.section, props.section === "calender")
  return (
      <AppointmentSection>
        <AppointmentSectionHeader color={props.color} section={props.section}>{header}</AppointmentSectionHeader>
        <VerticalLine />
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
