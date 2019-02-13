import React from "react";
import styled from "styled-components";

export default styled.p`
  margin: auto;
  font-family: "Rajdhani", sans-serif;
  font-size: ${props => props.fontSize || `150%`};
`;
