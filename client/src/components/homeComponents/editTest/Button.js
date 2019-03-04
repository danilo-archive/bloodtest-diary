import styled from "styled-components";

export default styled.div`
  width: ${props => (props.save ? `70%` : `20%`)};
  height: 20%;
  background: ${props => (props.save ? `#5BC714` : `#D10505`)};
  transition: 250ms;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Rajdhani", sans-serif;
  user-select: none;
  color: white;
  font-size: 35px;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.4;
  }
`;
