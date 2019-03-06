import React from "react";

import Icon from "./Icon";

export default props => {
  return (
    <div
      style={{
        width: "auto",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      <Icon icon="edit" />
      <Icon icon="check" onClick={props.onStatusClick} />
    </div>
  );
};
