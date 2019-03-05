import React from "react";
import styled from "styled-components";
import Label from "./Label.js";
import LabelBox from "./LabelBox";

const Container = styled.div`
  display: block;
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  margin: 3% 0;
  padding: 0;
  height: 14%;
  border-radius: 10px;
  border: solid 1px transparent;
  display: flex;
  width: auto;
  height: auto;
  transition: 250ms;
  &:hover {
    border: solid 1px #839595;
  }
`;

export default class InfoBox extends React.Component {
  render() {
    return (
      <>
        <Container>
          <Label>{this.props.label}</Label>
          <LabelBox
            button={{ onClick: this.props.onClick, icon: this.props.icon }}
            text={this.props.text}
          />
        </Container>
        <hr />
      </>
    );
  }
}
