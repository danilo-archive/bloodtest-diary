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
`;

function collect(connect, monitor){
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem()
  }
}



export default DropTarget("appointment", {}, collect) (props => {
  const { connectDropTarget, hovered, item} = props;
  return (
    <div>
      <AppointmentSection>
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
          />
        ))}
      </AppointmentSection>
    </div>
  );
});
