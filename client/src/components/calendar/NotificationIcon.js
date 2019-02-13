import React from "react";
import styled from "styled-components";

import Label from "../Label";

const Circle = styled.div`
  background-color: #028090;
  border-radius: 50%;

  display: flex;
  width: 30px;
  height: 30px;
  padding: 0;
  align-items: center;
  position: absolute;
  margin: auto;
  overflow: hidden;
`;

export default props => {
  return (
    <>
      <Circle style={{ top: props.top, left: props.left }}>
        <Label fontSize="23px">{props.text ? props.text : ``}</Label>
      </Circle>
    </>
  );
};
