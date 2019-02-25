import styled from "styled-components";
import React from "react";
import HorizontalLine from "./HorizontalLine";

const Heading = styled.h3`
  padding: 0;
  margin: 0;
  color: #646464;
  font-family: "Rajdhani", sans-serif;
  font-size: 150%;
  overflow: hidden;
`;

export default props => {
  return (
    <div style={{ zIndex: "5", backgroundColor: "white" }}>
      <HorizontalLine />
      <Heading>{props.children}</Heading>
      <HorizontalLine />
    </div>
  );
};
