import React from "react";
import styled from "styled-components";
import LabelAndSelector from "./LabelAndSelector";
import TextRadioButton from "../editTest/TextRadioButton";

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
        setFrequencyTooltip={props.setFrequencyTooltip}
        setOcurrencesTooltip={props.setOcurrencesTooltip}
        tooltips={{
          frequency: props.tooltips.frequency,
          occurrences: props.tooltips.occurrences
        }}
        frequency={props.frequency}
        occurrences={props.occurrences}
        noRepeat={props.noRepeat}
        timeAmount={props.timeAmount}
        options={props.unitOptions}
        onValueChange={value => props.onSliderChange(value)}
        onOccurrenceChange={value => props.onOccurrenceChange(value)}
        onSelectChange={timeUnit => {
          props.onSelectChange(timeUnit);
        }}
      />
      <br />
      <TextRadioButton
        checked={props.noRepeat}
        text="Do not repeat"
        onCheck={check => {
          return props.onNoRepeatChange(check);
        }}
      />
    </Container>
  );
};
