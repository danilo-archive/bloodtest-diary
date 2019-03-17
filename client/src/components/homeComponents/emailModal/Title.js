import React from "react";
import styled from "styled-components";
import TextLabel from "../editTest/Label";

const Container = styled.div`
  width: 100%;
  border-radius: 10px 10px 0 0;
  height: 10%;
  font-size: 25px;
  display: flex;
  justify-content: center;
  background: #0b999d;
  border-bottom: 1px #e8e8e8 solid;
`;

const Label = styled(TextLabel)`
  color: white;
`;

export default props => {
  return (
    <>
      <Container>
        <Label>{props.children}</Label>
      </Container>
      <br />
    </>
  );
};
