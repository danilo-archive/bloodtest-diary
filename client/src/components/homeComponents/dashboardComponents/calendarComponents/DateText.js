import React from "react";
import styled from "styled-components";

import Label from "../../../Label";

export default props => {
  return (
    <>
      <Label style={{ left: "50%", top: "65%" }} fontSize="490%" margin="0">
        {props.day}
      </Label>
      <Label style={{ left: "75%", top: "40%" }} fontSize="163%" margin="0">
        {props.month}
      </Label>
    </>
  );
};
