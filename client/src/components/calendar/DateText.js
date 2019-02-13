import React from "react";
import styled from "styled-components";

import Label from "../Label";

export default props => {
  return (
    <>
      <Label fontSize="100px" margin="0">
        {props.day}
      </Label>
      <Label margin="0">{props.month}</Label>
    </>
  );
};
