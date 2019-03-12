import React from "react";
import styled from "styled-components";

const Container = styled.div`
 margin: 1%;
 text-align: center;
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
  font-family: "Rajdhani", sans-serif;
`;


class InputCell extends React.Component {

    constructor(props) {
        super(props);
    }

    test() {
        console.log("i changed value");
    }

    render() {
        //TODO : improve this
        if (this.props.disabled === true) {
            return (
                <Container>
                    <Field for={this.props.id}>{this.props.field}</Field>
                    <Input
                        defaultValue={this.props.value}
                        id={this.props.id}
                        disabled
                        type={"text"}
                    />
                </Container>
            );
        } else if (this.props.type === "checkbox"){
            return (
                <Container
                    style={{width: `100%`}}
                >
                    <Field htmlFor={this.props.id}>{this.props.field}</Field>
                    <Input
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
                    <Field for={this.props.id}>{this.props.field}</Field>
                    <Input
                        defaultValue={this.props.value}
                        id={this.props.id}
                        type={"text"}
                        onChange={event => this.props.onChange()}
                    />
                </Container>
            );
        }
    }
}

export default InputCell;
