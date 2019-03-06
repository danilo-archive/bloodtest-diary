import styled from "styled-components";
import React from "react";

const NameDiv = styled.div`
  width: 100%;
  height: 100%;
  color: #646464;
  font-family: "Rajdhani", sans-serif;
  font-size: 120%;
  white-space: nowrap;
  text-align: left;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: scroll;
`;
export default props => {
  return <NameDiv>{props.name}</NameDiv>;
};
