import React from "react";
import styled from "styled-components";
import TextLabel from "./Label";
import TextRadioButton from "./TextRadioButton";
import { integerCheck } from "../../../lib/inputChecker";
import { Tooltip } from "react-tippy";
const Container = styled.div`
  display: flex;
  font-size: 0.7rem;
`;

const Input = styled.input`
  margin: 0 0.5rem;
  width: 20%;
  font-size: 1rem;
  height: 50%;
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
        <Tooltip
          unmountHTMLWhenHide={true}
          title="Please enter a number"
          open={props.tooltips.frequency}
          hideDelay={100}
          trigger="manual"
          onRequestClose={() => {
            props.setFrequencyTooltip(false);
          }}
        >
          <Input
            disabled={props.noRepeat}
            type="text"
            value={
              props.frequencyTimes === "null" || props.noRepeat
                ? ""
                : props.frequencyTimes
            }
            onChange={event => {
              if (
                integerCheck(event.target.value) ||
                event.target.value == ""
              ) {
                props.onFrequencyChange(event.target.value);
                props.setFrequencyTooltip(false);
              } else props.setFrequencyTooltip(true);
            }}
          />
        </Tooltip>
        <select
          defaultValue={props.frequencyUnit}
          disabled={props.noRepeat}
          onChange={event => props.onUnitChange(event.target.value)}
        >
          <option value="" disabled className="text-hide">
            Please select a month
          </option>
          {props.values.map(value => {
            return <option value={value.value}>{value.name}</option>;
          })}
        </select>
        <Label noRepeat={props.noRepeat} style={{ margin: "0 0 0 1rem" }}>
          For
        </Label>
        <Tooltip
          unmountHTMLWhenHide={true}
          title="Please enter a number"
          open={props.tooltips.occurrences}
          hideDelay={100}
          trigger="manual"
          onRequestClose={() => {
            props.setOcurrencesTooltip(false);
          }}
        >
          <Input
            disabled={props.noRepeat}
            value={
              props.occurrences === "null" || props.noRepeat
                ? ""
                : props.occurrences
            }
            type="text"
            onChange={event => {
              if (
                integerCheck(event.target.value) ||
                event.target.value == ""
              ) {
                props.onOccurrencesChange(event.target.value);
                props.setOcurrencesTooltip(false);
              } else props.setOcurrencesTooltip(true);
            }}
          />
        </Tooltip>
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
