import styled from "styled-components";
import React from "react";

const RadioButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  cursor: default;
  user-select: none;
`;
const RadioButtonComponent = styled.input.attrs({ type: "checkbox" })`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  appearance: none;
  outline: none;
  border: solid 3px #0d4e56;
  margin: 0 5px 0 0;
  padding: 0;
  transition: 100ms;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background: #0b999d;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0;
    transition: 100ms;
  }
  &:checked {
    border: solid 3px #0b999d;
  }

  &:checked::before {
    opacity: 1;
  }
`;
const RadioButton = props => {
  return (
    <RadioButtonContainer>
      <RadioButtonComponent
        checked={props.checked}
        onClick={e => props.onCheck(e.target.checked)}
      />
    </RadioButtonContainer>
  );
};
export default RadioButton;
