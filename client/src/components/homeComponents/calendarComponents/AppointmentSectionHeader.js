import styled from "styled-components";
import React from "react";

const Heading = styled.h3`
  padding: 0;
  margin-top: 2.5%;
  margin-bottom: 0%;
  color: #646464;
  border-radius: 2px;
  border-top: solid 3.5px  ${props => props.color || `white`};
  border-bottom: solid 3.5px  ${props => props.color || `white`};
  font-family: "Rajdhani", sans-serif;
  font-size: 150%;
  height: 35px;
  overflow: hidden;
  z-index: 5;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default props => {
  return (
      <Heading color={props.color}>{props.children}</Heading>
  );
};
