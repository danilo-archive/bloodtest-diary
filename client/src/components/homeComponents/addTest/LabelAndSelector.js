import React from "react";
import styled from "styled-components";

import Label from "../../Label";
import { integerCheck } from "../../../lib/inputChecker";
import { Tooltip } from "react-tippy";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
  white-space: nowrap;
  aling-items: center;
`;
const Text = styled(Label)`
  position: relative;
  margin: 0 1rem;

  color: ${props => (props.noRepeat ? `#c9c9c9` : `#0d4e56`)};
  transform: translate(0, 0);
`;
const Input = styled.input`
  width: 40%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select``;
export default props => {
  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", margin: "0 0 3% 0" }}>
          <Text noRepeat={props.noRepeat}>
            <>
              Repeat every:{"  "}
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
                  value={
                    props.frequency === "null" || props.noRepeat
                      ? ""
                      : props.frequency
                  }
                  disabled={props.noRepeat}
                  type="text"
                  onChange={event => {
                    if (
                      integerCheck(event.target.value) ||
                      event.target.value == ""
                    ) {
                      props.onValueChange(event.target.value);
                      props.setFrequencyTooltip(false);
                    } else {
                      props.setFrequencyTooltip(true);
                    }
                  }}
                />
              </Tooltip>
            </>
          </Text>
          <Select
            disabled={props.noRepeat}
            onChange={event => props.onSelectChange(event.target.value)}
          >
            {props.options.map(option => {
              return <option value={option}>{option}</option>;
            })}
          </Select>
        </div>
        <Text noRepeat={props.noRepeat}>
          <>
            Number of tests:{" "}
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
                value={
                  props.occurrences === "null" || props.noRepeat
                    ? ""
                    : props.occurrences
                }
                disabled={props.noRepeat}
                type="text"
                onChange={event => {
                  if (
                    integerCheck(event.target.value) ||
                    event.target.value == ""
                  ) {
                    props.onOccurrenceChange(event.target.value);
                    props.setOcurrencesTooltip(false);
                  } else {
                    props.setOcurrencesTooltip(true);
                  }
                }}
              />
            </Tooltip>
          </>
        </Text>
      </div>
    </Container>
  );
};
