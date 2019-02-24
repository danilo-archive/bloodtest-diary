import React from "react";
import styled, { keyframes } from "styled-components";

const Box = styled.div`
  position: relative;
  width: 80%;
  height: 10%;
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
  background: #0d4e56;
  font-size: 1.25rem;
  cursor: pointer;
  outline: none;
`;

export default props => {
  return (
    <>
      <Box>
        {props.patientName}
        <SelectButton>
          <i className="fa fa-check" />
        </SelectButton>
        {props.showID ? <IDBox>Patient ID: {props.patientID}</IDBox> : <></>}
      </Box>
      {props.showID ? <br /> : <></>}
      <br />
    </>
  );
};
