import styled from "styled-components";
import React from "react";
import HorizontalLine from "./HorizontalLine";

const Heading = styled.h3`
  padding: 1%;
  margin: 2.5%;
  color: #646464;
  border-radius: 5px;
  font-family: "Rajdhani", sans-serif;
  font-size: 150%;
  overflow: hidden;
  zIndex: 5;
  background-color: ${props => props.color || `white`};
`;

export default props => {
  return (
      <Heading color={props.color}>{props.children}</Heading>
  );
};
