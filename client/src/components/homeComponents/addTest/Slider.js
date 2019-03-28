import styled from "styled-components";
import React from "react";

const Slider = styled.input.attrs({ type: "range" })`
    appearance:none;
    outline:none;
    width: 100%;
    background-color: #e5e5e5;
    height 8px;
    &::-webkit-slider-thumb{
        appearance:none;
        width:15px;
        height:15px;
        background: #0d4e56;
        transition: background 250ms;
        border-radius:50%;

    }
    &:hover{

        &::-webkit-slider-thumb{
            background: #0b999d;
        }
    }
`;

export default props => {
  return (
    <Slider
      min={props.min}
      max={props.max}
      onInput={event => props.onChange(event.target.value)}
    />
  );
};
