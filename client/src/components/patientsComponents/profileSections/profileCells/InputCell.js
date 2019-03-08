import React from "react";
import styled from "styled-components";

const Container = styled.div`
 margin: 1%;
 text-align: center;
`;

const Field = styled.label`
  font-weight: 200;
`;

const Value = styled.input.attrs({ type: "text" , spellCheck: "false"})`
  padding: 12px 20px;
  margin: 2px 0 8px;
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: "Rajdhani", sans-serif;
  :disabled {
    background: white;
  }
`;


export default class InputCell extends React.Component {
    render() {
        if (this.props.disabled === "true") {
            return (
                <Container>
                    <Field for={this.props.id}>{this.props.field}</Field>
                    <Value
                        defaultValue={this.props.value}
                        id={this.props.id}
                        disabled
                    />
                </Container>
            );
        } else {
            return (
                <Container>
                    <Field for={this.props.id}>{this.props.field}</Field>
                    <Value
                        defaultValue={this.props.value}
                        id={this.props.id}
                    />
                </Container>
            );
        }
    }
}