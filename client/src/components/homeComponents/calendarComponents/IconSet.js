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
      <Icon icon="edit" onClick={() => {}} />
      <Icon icon="check" onClick={props.onStatusClick} />
      <Icon icon="times" onClick={props.onStatusClick} />
    </div>
  );
};
