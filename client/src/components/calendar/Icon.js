import React from "react";
import styled from "styled-components";

const combinations = {
  check: "#5BC714",
  times: "#D10505",
  edit: "#FFD907"
};

const Icon = styled.i`
  transition: opacity ease-in 250ms;
  opacity: 1;

  &:hover {
    opacity: 0.3;
  }
`;

export default props => {
  return (
    <Icon
      className={`fa fa-${props.icon}`}
      style={{ color: combinations[props.icon], fontSize: "150%" }}
      onClick={() => alert(`You clicked: ${props.icon}`)}
    />
  );
};
