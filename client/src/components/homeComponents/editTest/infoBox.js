import React from "react";
import styled from "styled-components";
import Label from "./Label.js";
import LabelBox from "./LabelBox";

const Container = styled.div`
  display: block;
  position: relative;
  margin-top: 0;
  background: #eddfc4;
  margin-bottom: 0;
  margin: 2.5%;
  padding: 0%;
  height: 14%;
  border-radius: 0px;
  display: flex;
  width: 100%;
  height: auto;

`;

export default class InfoBox extends React.Component {
    render() {
      return (
        <Container>
          <Label>{this.props.label}</Label>
          <LabelBox button={{onClick:()=>console.log("Yo"), icon:'check'}} text = {this.props.text} />
        </Container>
      );
    }
}
