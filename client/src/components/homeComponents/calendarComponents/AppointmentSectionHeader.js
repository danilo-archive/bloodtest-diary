import styled from "styled-components";
import React from "react";

const Heading = styled.h3`
  padding: 0;
  margin-top: 2.5%;
  margin-bottom: 0%;
  color: #646464;
  border-radius: 2px;
  border-bottom: solid 1.5px rgb(100, 100, 100, 0.5);
  
  font-size: 150%;
  height: 35px;
  overflow: hidden;
  z-index: 5;
  background-color: ${props => props.color || `white`};

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default props => {
  return (
      <Heading color={props.color}>{props.children}</Heading>
  );
};
