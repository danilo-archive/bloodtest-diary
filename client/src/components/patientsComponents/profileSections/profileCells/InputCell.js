import React from "react";
import styled from "styled-components";

const Container = styled.div`
 margin: 1%;
 text-align: center;
`;

const Field = styled.label`
  font-weight: 200;
`;

const Value = styled.input.attrs({ spellCheck: "false"})`
  padding: 12px 20px;
  margin: 2px 0 8px;
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: "Rajdhani", sans-serif;
`;

class InputCell extends React.Component {

    constructor(props) {
        super(props);

        this.type = (this.props.type === "checkbox") ? "checkbox" : "text";
    }

    render() {
        if (this.props.disabled === true) {
            return (
                <Container>
                    <Field for={this.props.id}>{this.props.field}</Field>
                    <Value
                        defaultValue={this.props.value}
                        id={this.props.id}
                        disabled
                        checked
                        type={this.type}
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
                        type={this.type}
                        onChange={this.props.onChange}
                    />
                </Container>
            );
        }
    }
}

export default InputCell;