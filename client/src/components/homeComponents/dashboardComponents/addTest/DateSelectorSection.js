import React from "react";
import styled from "styled-components";
import TitleTab from "./TitleTab";

const Container = styled.div`
  width: 49.8%;
  height: 100%;
  background: red;
`;

export default props => {
  return (
    <>
      <Container>
        <TitleTab color="#0b999d">Date</TitleTab>
        <input type="text" placeholder="Select Date..." />
      </Container>
    </>
  );
};
