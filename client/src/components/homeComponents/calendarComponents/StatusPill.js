/**
 * This component renders the pill that appears together with the status circle
 * @module StatusPill
 * @author Alvaro Rausell
 * @version 0.0.2
 */

import styled, { keyframes } from "styled-components";

const combinations = {
  completed: "#5BC714",
  late: "#D10505",
  pending: "#FFD907",
  inReview: "#4286f4"
};

const animation = keyframes`
    0% {max-width:0;}
    100% {  max-width:150%;}
`;
export default styled.div`
  position: absolute;
  padding: 0 10% 0 10%;
  color: white;
  background-color: ${props => combinations[props.status]};
  height: 100%;
  max-width: 0;
  left: 50%;
  overflow: hidden;
  top: 0;
  animation: ${animation} 250ms ease-in;
  animation-delay: 1s;
  z-index: -1;
`;
