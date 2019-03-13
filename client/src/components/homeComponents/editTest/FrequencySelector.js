import React from "react";
import styled from "styled-components";
import Label from "./Label";

const Container = styled.div`
  display: flex;
  font-size: 0.7rem;
`;

const Input = styled.input`
  margin: 0 0.5rem;
  width: 10%;
  font-size: 2rem;
  height: 50%;
`;
export default props => {
  return (
    <Container>
      <Label>Repeat every</Label>
      <Input
        type="text"
        value={props.frequencyTimes === "null" ? "" : props.frequencyTimes}
        onChange={event => props.onFrequencyChange(event.target.value)}
      />
      <select
        defaultValue={props.frequencyUnit}
        onChange={event => props.onUnitChange(event.target.value)}
      >
        <option value="" disabled className="text-hide">
          Please select a month
        </option>
        {props.values.map(value => {
          return <option value={value.value}>{value.name}</option>;
        })}
      </select>
      <Label style={{ margin: "0 0 0 1rem" }}>For</Label>
      <Input
        value={props.occurrences === "null" ? "" : props.occurrences}
        type="text"
        onChange={event => props.onOccurrencesChange(event.target.value)}
      />
      <Label>Times</Label>
    </Container>
  );
};
