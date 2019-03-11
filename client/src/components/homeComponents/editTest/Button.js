import styled from "styled-components";

export default styled.div`
  width: ${props => (props.save ? `20rem` : `15rem`)};
  height: 5rem;
  background: ${props => (props.save ? `#5BC714` : `#D10505`)};
  transition: 250ms;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Rajdhani", sans-serif;
  user-select: none;
  color: white;
  font-size: 35px;
  white-space: nowrap;
  &:hover {
    background: ${props => (props.save ? `#469b0d` : `#a00303`)};  }
  &:active {
    background: ${props => (props.save ? `#387c0b` : `#680101`)};  }

  }
`;
