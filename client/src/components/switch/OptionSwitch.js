import React from "react";
import styled from "styled-components";

import Switch from "./Switch";
import Label from "../Label";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Option = styled(Label)`
  position: relative;
  transform: translate(0, 0);

  font-size: 1.05rem;
  color: black;
  margin: 0 0.5rem;
`;

export default props => {
  return (
    <Container>
      <Option>{props.option1}</Option>
      <Switch checked={props.checked} onToggleClick={props.onChange} />
      <Option>{props.option2}</Option>
    </Container>
  );
};
