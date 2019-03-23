import styled from "styled-components";

export default styled.button`
  border: none;
  background-color: ${props => props.backgroundColor};
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  margin-left: 1%;
  margin-right: 1%;
  height: 44px;
  min-width: 100px;

  :hover {
    background-color: ${props => props.hoverColor};
    color: white;
    border-radius: 10px;
  }
  outline: none;
`;