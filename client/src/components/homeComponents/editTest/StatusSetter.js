import React from "react";
import styled from "styled-components";
import TextRadioButton from "./TextRadioButton";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const status = ["completed", "in review", "pending"];
export default props => {
  return (
    <Container>
      {status.map(status => (
        <TextRadioButton
          text={status}
          checked={props.currentStatus === status}
          onCheck={checked => props.onStatusCheck(status, checked)}
        />
      ))}
    </Container>
  );
};
