import React from "react";
import styled from "styled-components";

const Toggle = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  display: flex;
  align-items: center;
  position: relative;
  width: 4rem;
  height: 1.8rem;
  border-radius: 4em;
  background: ;
  margin: 0;
  padding: 0;

  &::before {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: #ffff;
    transform: translate(-50%, -50%);
    left: 25%;
    top: 50%;
    transition: left 250ms;
    z-index: 1;
    width: 2rem;
    height: 2rem;
    border: solid 0.5px #d0d0d0;
    cursor: pointer;
  }
  &:checked::before {
    left: 75%;
  }

  &::after {
    content: "";
    position: absolute;
    border-radius: 2rem;
    background: #0b999d;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    width: 92%;
    height: 90%;
    transition: background 250ms;
  }
  &:checked::after {
    background: #0d4e56;
    filter: blur(0.5px);
  }
`;

export default class Switch extends React.Component {
  state = { checked: false };

  onToggleClick = () => {
    this.setState({ checked: !this.state.checked });
    this.props.onToggleClick(this.state.checked);
  };
  render() {
    return (
      <Toggle onChange={this.onToggleClick} checked={this.state.checked} />
    );
  }
}
