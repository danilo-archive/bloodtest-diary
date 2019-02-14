import React from "react";

const combinations = {
  check: "#5BC714",
  times: "#D10505",
  edit: "#FFD907"
};

export default props => {
  return (
    <i
      className={`fa fa-${props.icon}`}
      style={{ color: combinations[props.icon] }}
    />
  );
};
