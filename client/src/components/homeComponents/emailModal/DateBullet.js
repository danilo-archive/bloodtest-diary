import React from "react";
import styled from "styled-components";
import TextLabel from "../editTest/Label";
import formatDate from "dateformat";

const Container = styled.div`
  border-radius: 0px 36px 36px 0px;
  background: #0b999d;
  height: 100%;
  float: left;
  width: 25%;
  overflow: hidden;
  text-align: center;

  padding: 0 2%;
`;

const Label = styled(TextLabel)`
  color: white;
  font-size: 17px;
`;
export default props => {
  return (
    <Container>
      <Label>{formatDate((new Date(props.dueDate)), "dS mmm yyyy")}</Label>
    </Container>
  );
};
