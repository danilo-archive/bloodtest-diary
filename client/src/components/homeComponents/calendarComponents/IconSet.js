import React from "react";

import Icon from "./Icon";

export default props => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "0",
        position: "absolute",
        right: "1%"
      }}
    >
      <Icon icon="edit" onClick={props.editTest} testId={props.testId} />
      <Icon icon="check" onClick={props.onStatusClick} />
    </div>
  );
};
