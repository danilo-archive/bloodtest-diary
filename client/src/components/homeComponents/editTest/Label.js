import styled from "styled-components";

export default styled.div`
  position: relative;
  padding-left: 1%;
  margin-right: 0;
  width: ${props => props.width ? props.width : "100%"};
  min-width: 10%;
  height: 100%;
  color: inherit;
  
  font-size: 200%;
  overflow: hidden;
  display: flex;
  align-items: center;
`;
