import React from "react";
import styled from "styled-components";
import Label from "./Label.js";
import LeftButton from "./LeftButton.js";

const LabelBoxDiv = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0;
  padding: 0.5rem 0 0 0;
  padding-left: 3%;
  margin-left: 1%;
  width: 60%;
  hight: 100%;
  align-items: center;
  transition: 100ms;
  background: #c1c1c1;
  border-radius: 10px;
`;

export default props => {
  if (props.button.icon === undefined) {
    return (
      <LabelBoxDiv>
        <Label>{props.text}</Label>
      </LabelBoxDiv>
    );
  }
  return (
    <LabelBoxDiv>
      <Label>{props.text}</Label>
      <LeftButton onClick={props.button.onClick}>
        <i className={`fa fa-${props.button.icon}`} />
      </LeftButton>
    </LabelBoxDiv>
  );
};
