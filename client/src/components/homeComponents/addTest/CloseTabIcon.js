import React from "react";
import styled from "styled-components";
import Label from "../../Label";

const XText = styled(Label)`
  font-size: 1rem;
  color: white;
  top: 55%;
  left: 50%;
`;

const CloseDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 5%;
  height: 50%;
  background: red;
  cursor: pointer;
`;

export default props => {
  return (
    <CloseDiv onClick={props.close}>
      <XText>X</XText>
    </CloseDiv>
  );
};
