import React from "react";
import styled from "styled-components";
import Label from "./Label.js";
import LeftButton from "./LeftButton.js";

const LabelBoxDiv = styled.div`
  display:flex;
  border: #839595 2px solid;
  border-radius: 10px;
  position: absolute;
  right:0;
  top:0;
  bottom:0;
  margin:0;
  padding-left: 3%;
  margin-left: 1%;
  width: 60%;
  hight: 100%;
  align-items:center;

`;

export default props => {
  return (
      <LabelBoxDiv>
        <Label>{props.text}</Label>
        <LeftButton onClick={props.button.onClick}><i className={`fa fa-${props.button.icon}`}/></LeftButton>
      </LabelBoxDiv>
  );
};
