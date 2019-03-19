import styled from "styled-components";
import React from "react";
import Label from "../editTest/Label";

const Container = styled.div`
  position: absolute;
  width: 200px;
  height: 70px;

  background: #0d4e56;
  border-radius: 10px 0 0 0;
  font-size: 29px;
  float: right;
  display: flex;
  justify-content: center;
  overflow: hidden;
  bottom: 0;
  right: 0;
  transition: 250ms;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: #0b999d;
  }
  &:active {
    background: #0db5ba;
  }
`;

export default props => {
  return (
    <Container onClick={props.onClick}>
      <Label style={{ color: "white" }}>Submit</Label>
    </Container>
  );
};
