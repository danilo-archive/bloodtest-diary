import styled from "styled-components";
import React from "react";

const NameDiv = styled.div`
  padding: 3%;
  margin: 2.5%;
  width: 50%;
  height: 200%;
  color: #646464;
  font-family: "Rajdhani", sans-serif;
  font-size: 120%;
  overflow: scroll;
  white-space: nowrap;
`;
export default props => {
  return <NameDiv>{props.name}</NameDiv>;
};
