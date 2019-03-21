import React from "react";
import styled from "styled-components";
import TextLabel from "./Label";
import TextRadioButton from "./TextRadioButton";

const Container = styled.div`
  display: flex;
  font-size: 0.7rem;
`;

const Input = styled.input`
  margin: 0 0.5rem;
  width: 15%;
  font-size:  1.3rem;
  height: 70%;
  background-color: white;
  border: solid 1px #aaaaaa;
`;
const Label = styled(TextLabel)`
  color: ${props => (props.noRepeat ? `#c9c9c9` : `#0d4e56`)};
`;
export default props => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <Container>
        <Label noRepeat={props.noRepeat}>Repeat every</Label>
        <Input
          disabled={props.noRepeat}
          type="text"
          value={
            props.frequencyTimes === "null" || props.noRepeat
              ? ""
              : props.frequencyTimes
          }
          onChange={event => props.onFrequencyChange(event.target.value)}
        />
        <select style={{height: "30px"}}
          defaultValue={props.frequencyUnit}
          disabled={props.noRepeat}
          onChange={event => props.onUnitChange(event.target.value)}
        >
          <option value="" disabled className="text-hide">
            select
          </option>
          {props.values.map(value => {
            return <option value={value.value}>{value.name}</option>;
          })}
        </select>
        <Label noRepeat={props.noRepeat} style={{ margin: "0 0 0 1rem" }}>
          For
        </Label>
        <Input 
          disabled={props.noRepeat}
          value={
            props.occurrences === "null" || props.noRepeat
              ? ""
              : props.occurrences
          }
          type="text"
          onChange={event => props.onOccurrencesChange(event.target.value)}
        />
        <Label noRepeat={props.noRepeat}>Times</Label>
      </Container>
      <TextRadioButton
        checked={props.noRepeat}
        onCheck={props.onCheck}
        text="Do not Repeat"
        style={{ margin: "auto" }}
      />
    </div>
  );
};
