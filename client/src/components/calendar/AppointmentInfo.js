import styled from "styled-components";
import React from "react";

const NameDiv = styled.div`
  padding: 0;
  margin: 5%;
  width: 50%;
  height: 80%;
  color: #646464;
  font-family: "Rajdhani", sans-serif;
  font-size: 140%;
  overflow: scroll;
  white-space: nowrap;
`;
export default props => {
  return <NameDiv>{props.name}</NameDiv>;
};
