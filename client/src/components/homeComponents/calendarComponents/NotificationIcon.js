/**
 * Green circle icon with a label inside.
 * Used to show how many tests there are in a section.
 * @module NotificationIcon
 * @author Alvaro Rausell
 * @version 0.0.2
 */

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
          style={props.labelStyle}
          fontSize={props.fontSize || "23px"}
        >
          {props.text ? props.text : ``}
        </Label>
      </Circle>
    </>
  );
};
