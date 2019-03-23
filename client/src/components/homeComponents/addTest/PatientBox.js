import React from "react";
import styled, { keyframes } from "styled-components";
import TimePill from "../calendarComponents/TimePill";

const Box = styled.div`
  position: relative;
  background: #eeeeee;
  width: 80%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-top: 1%;
  
  :hover {
    background: #f2f2f2f2;
  }
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
  border: none;
  width: 12%;
  height: 100%;
  top: 0;
  left: 100%;
  transform: translateX(-100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${props => (props.selected ? "#5BC714" : `#0b999d`)};
  font-size: 1.25rem;
  cursor: pointer;
  outline: none;
  border-radius: 0;

  &:hover {
    background: ${props => (props.selected ? "#62db13" : `#137f8c`)};
  }
`;

export default props => {
  return (
    <>
      <Box>
        {props.patientName}
        {props.selected ? <TimePill>Selected</TimePill> : ``}
        <SelectButton
          selected={props.selected}
          onClick={() => {
            return props.onSelectClick(!props.selected ? props.patientID : "");
          }}
        >
          <i className={`fa fa-${!props.selected ? `check` : `times`}`} />
        </SelectButton>
        {props.showID ? <IDBox>Patient number: {props.patientID}</IDBox> : <></>}
      </Box>
      {props.showID ? <br /> : <></>}
      <br />
    </>
  );
};
