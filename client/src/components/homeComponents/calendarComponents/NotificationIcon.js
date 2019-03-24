import React from "react";
import styled from "styled-components";

import Label from "../../Label";

const Circle = styled.div`
  background-color: #028090;
  border-radius: 50%;
  display: flex;
  width: ${props => props.size || `35px`};
  height: ${props => props.size || `35px`};
  padding: 0;
  align-items: center;
  position: absolute;
  margin: auto;
  overflow: hidden;
  transition: background-color 0.2s ease;
  margin: auto;
  transform: translate(-50%, -50%);
  z-index: 10;
  &:hover {
    background-color: #00b0c6;
    transition: background-color 0.2s ease;
  }
`;

export default props => {
  return (
    <>
      <Circle
        size={props.size}
        style={{ top: props.top, left: props.left, }}
        onClick={props.onClick}
      >
        <Label
          style={props.isPlus ? { left: "51%", top: "63%" } : { left: "48%", top : "58%"}}
          fontSize={props.fontSize || "23px"}
        >
          {props.text ? props.text : ``}
        </Label>
      </Circle>
    </>
  );
};
