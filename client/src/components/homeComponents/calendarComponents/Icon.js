import React from "react";
import styled from "styled-components";

const combinations = {
  check: { color: "#5BC714", status: "completed" },
  times: { color: "#D10505", status: "late" },
  edit: { color: "#FFD907", status: "edit" }
};

const Icon = styled.i`
  transition: opacity ease-in 250ms;
  opacity: 1;
  margin-left: 7px;
  &:hover {
    opacity: 0.3;
  }
`;

export default props => {
  return (
    <Icon
      className={`fa fa-${props.icon}`}
      style={{ color: combinations[props.icon].color, fontSize: "150%" }}
      onClick={() => props.onClick(combinations[props.icon].status)}
    />
  );
};
