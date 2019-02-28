import styled from "styled-components";

export default styled.p`
  margin: auto;
  font-family: "Rajdhani", sans-serif;
  font-size: ${props => props.fontSize || `150%`};
  position: absolute;
  transform: translate(-50%, -50%);
  user-select: none;
  color: #e2e2d9;
`;
