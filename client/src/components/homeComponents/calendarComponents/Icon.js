/**
 * A single icon component.
 * There can be three kind of icons in the app.
 * @module Icon
 * @author Alvaro Rausell
 * @version 0.0.2
 */

import React from "react";
import styled from "styled-components";

const combinations = {
  check: { color: "#5BC714", status: "completed" },
  times: { color: "#D10505", status: "late" },
  edit: { color: "#FFD907", status: "edit" },
  envelope: {color: "rgb(255,226,102, 1)"}
};

const Icon = styled.i`
  transition: opacity ease-in 250ms;
  opacity: 1;
  margin-left: 5px;
  cursor: pointer;
  ${props =>
    !props.asLabel
      ? ` &:hover {
    opacity: 0.5;
  }`
      : ``}
`;

export default props => {
  return (
    <Icon
      asLabel={props.asLabel}
      className={`fa fa-${props.icon}`}
      style={{
        color: combinations[props.icon].color,
        fontSize: "150%",
        ...props.style
      }}
      onClick={() => {
        if (props.icon === "check") {
          props.onClick(combinations[props.icon].status);
        } else {
          props.onClick(props.testId);
        }
      }}
    />
  );
};
