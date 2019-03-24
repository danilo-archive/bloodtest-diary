import React from "react";
import styled, { keyframes } from "styled-components";
import TimePillDiv from "../calendarComponents/TimePill";
import dateformat from "dateformat";

const Box = styled.div`
  position: relative;
  width: 80%;
  height: 20%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
`;
const IDBox = styled.div`
position: absolute;
display: flex;
align-items: center;
justify-content:center;
top: 100%;
left: 0;
background: rgba(204, 204, 204, 1);
width: 100%;
height: 50%;
content: "Patient ID: ${props => props.id || "Not defined"}";

`;
const SelectButton = styled.button`
  position: absolute;
  appearance: none;
  width: 10%;
  height: 100%;
  top: 0;
  left: 100%;
  transform: translateX(-100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${props => (props.selected ? "#5BC714" : `#0d4e56`)};
  font-size: 1.25rem;
  cursor: pointer;
  outline: none;
  border-radius: 0;

  &:hover {
    background: ${props => (props.selected ? "#62db13" : `#137f8c`)};
  }
`;
const TimePill = styled(TimePillDiv)`
  white-space: nowrap;
`;
export default props => {
  return (
    <>
      <Box>
        {props.patientName}
        {props.lastReminder && props.showID ? (
          <TimePill>
            Last Reminder: {dateformat(new Date(props.dueDate), "d mmm yyyy")}
          </TimePill>
        ) : (
          ``
        )}
        <SelectButton
          selected={props.selected}
          onClick={() => {
            return props.onSelectClick(props.patientID);
          }}
        >
          <i className={`fa fa-${!props.selected ? `check` : `times`}`} />
        </SelectButton>
        {props.showID ? (
          <IDBox>
            {" "}
            <b>Test ID:&nbsp;</b> {props.patientID} &nbsp;&nbsp;
            <b>Due date:&nbsp;</b>
            {dateformat(new Date(props.dueDate), "d mmm yyyy")}
          </IDBox>
        ) : (
          <></>
        )}
      </Box>
      {props.showID ? <br /> : <></>}
      <br />
    </>
  );
};
