/**
 * A set of x incos displayed as an inline-block
 * @module IconSet
 * @author Alvaro Rausell
 * @version 0.0.2
 */

import React from "react";

import Icon from "./Icon";

export default props => {
  return (
    <div
      style={{
        width: "auto",
        display: "inline-block",
        whiteSpace: "nowrap",
        marginLeft: "7px",
        marginRight: "7px",
      }}
    >
      <Icon icon="edit" onClick={props.editTest} testId={props.testId} />
      <Icon icon="check" onClick={props.onStatusClick} />
    </div>
  );
};
