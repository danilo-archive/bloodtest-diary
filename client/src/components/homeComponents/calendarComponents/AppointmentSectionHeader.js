import styled from "styled-components";
import React from "react";

const Heading = styled.h3`
  padding: 0;
  margin-top: 2.5%;
  margin-bottom: 2.5%;
  color: #646464;
  border-radius: 5px;
  font-family: "Rajdhani", sans-serif;
  font-size: 150%;
  height: 35px;
  overflow: hidden;
  z-index: 5;
  background-color: white;
`;

export default props => {
  return (
      <Heading>{props.children}</Heading>
  );
};
