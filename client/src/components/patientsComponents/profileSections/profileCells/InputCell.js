/**
 * Class renders input elements of different types depending on the parent props.
 *
 */

import React from "react";
import styled from "styled-components";

const Container = styled.div`
 margin: 1%;
 text-align: center;
 width: 30%;
`;

const Field = styled.label`
  font-weight: 200;
`;

const Input = styled.input.attrs({ spellCheck: "false"})`
  padding: 1% 4%;
  margin: 0.5% 0 1%;
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  
`;
const RadioButtonFieldContainer = styled.div`
  width: 100%;
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


class InputCell extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.disabled === true) {
            return (
                <Container>
                    <Field htmlFor={this.props.id}>{this.props.field}</Field>
                    <Input
                        defaultValue={this.props.value}
                        id={this.props.id}
                        disabled
                        type={"text"}
                        placeholder={this.props.placeholder}
                    />
                </Container>
            );
        } else if (this.props.type === "checkbox"){
            return (
                <Container
                    style={{width: `100%`, margin: `0`}}
                >
                    <RadioButtonFieldContainer>
                        <Field htmlFor={this.props.id}>{this.props.field}</Field>
                    </RadioButtonFieldContainer>
                    <RadioButtonComponent
                        defaultValue={this.props.value}
                        id={this.props.id}
                        type={this.props.type}
                        defaultChecked={this.props.value}
                        onChange={this.props.onChange}
                    />
                </Container>
            );
        } else {
            return (
                <Container>
                    <Field htmlFor={this.props.id}>{this.props.field}</Field>
                    <Input
                        defaultValue={this.props.value}
                        id={this.props.id}
                        type={"text"}
                        onChange={event => this.props.onChange()}
                        placeholder={this.props.placeholder}
                    />
                </Container>
            );
        }
    }
}

export default InputCell;
