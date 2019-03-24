import React from "react";
import styled from "styled-components";
import Label from "../../Label";

const Container = styled.div`
  width: 100%;
  height: 12%;
  background: ${props => props.color || `#0d4e56`};
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  white-space: nowrap;
`;

const TitleLabel = styled(Label)`
  position: absolute;
  top: 60%;
  left: 50%;
  color: white;
  font-size: 3rem;
`;

export default props => {
  return (
    <>
      <Container>
        <TitleLabel>{props.children}</TitleLabel>
      </Container>
      <br />
    </>
  );
};
