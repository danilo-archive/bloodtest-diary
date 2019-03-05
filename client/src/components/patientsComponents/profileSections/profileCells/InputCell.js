import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Field = styled.div`
  position: relative;
  padding-left: 1%;
  width: auto;
  min-width: 10%;
  margin: 0 2.5%;
  height: 100%;
  color: inherit;
  font-family: "Rajdhani", sans-serif;
  font-size: 200%;
  overflow: scroll;
  display:flex;
  align-items:center;;
`;

const Value = styled.textarea`
  width: 10%;
  height: 10%;
`;


export default class InfoCell extends React.Component {
    render() {
        return (
            <Container >
                <Field>{this.props.field}</Field>
                <Value>{this.props.value}</Value>
            </Container>
        );
    }
}