import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Field = styled.div`
  position: relative;
  padding-left: 1%;
  width: 30%;
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

const Value = styled.input.attrs({ type: "text" , spellCheck: "false"})`
  font-size: 125%;
  width: 63%;
  height: 10%;
  font-family: "Rajdhani", sans-serif;
  background: inherit;
  outline: none;
`;


export default class InfoCell extends React.Component {
    render() {
        return (
            <Container >
                <Field>{this.props.field}</Field>
                <Value
                    defaultValue={this.props.value}
                />
            </Container>
        );
    }
}