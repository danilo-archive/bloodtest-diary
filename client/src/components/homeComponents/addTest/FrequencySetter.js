import React from "react";
import styled from "styled-components";
import LabelAndSelector from "./LabelAndSelector";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default props => {
  return (
    <Container>
      <br />
      <LabelAndSelector
        timeAmount={props.timeAmount}
        options={props.unitOptions}
        onValueChange={value => props.onSliderChange(value)}
        onOccurrenceChange={value => props.onOccurrenceChange(value)}
        onSelectChange={timeUnit => {
          props.onSelectChange(timeUnit);
        }}
      />
      <br />
    </Container>
  );
};
