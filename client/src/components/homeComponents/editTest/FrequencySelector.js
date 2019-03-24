import React from "react";
import styled from "styled-components";
import TextLabel from "./Label";
import TextRadioButton from "./TextRadioButton";
import { integerCheck } from "../../../lib/inputChecker";
import { Tooltip } from "react-tippy";
const Container = styled.div`
  display: flex;
  justifyContent: "center"
  align-items: center;
  font-size: 0.7rem;
  height: 20%;
`;

const Input = styled.input`
  position: relative;
  padding: 1px 0 1px 1px;
  margin-right: 3px;
  margin-top: 3px;
  width: 80%;
  font-size:  1.3rem;
  height: 60%;
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
        flexDirection: "column",
      }}
    >
      <Container>
        <Label width={"100%"} noRepeat={props.noRepeat}>Repeat every</Label>
        <Tooltip style={{height: "2rem"}}
          unmountHTMLWhenHide={true}
          title="Please enter a number."
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
        <select style={{width: "inherit", margin: "3px 1rem 0 1rem", height: "1.45rem"}}
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
        <Label width={"55%"} noRepeat={props.noRepeat} >
          Repeat
        </Label>
        <Tooltip style={{height: "2rem"}}
          unmountHTMLWhenHide={true}
          title="Please enter a number."
          open={props.tooltips.occurrences}
          hideDelay={100}
          trigger="manual"
          onRequestClose={() => {
            props.setOcurrencesTooltip(false);
          }}
        >
          <Input style={{marginRight: "1rem"}}
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
        <Label width={"50%"} noRepeat={props.noRepeat}>times</Label>
      </Container>
      <TextRadioButton
        checked={props.noRepeat}
        onCheck={props.onCheck}
        text="Do not repeat"
        style={{ margin: "auto" }}
      />
    </div>
  );
};
