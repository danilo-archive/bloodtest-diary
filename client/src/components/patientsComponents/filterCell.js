import React from "react";
import styled from "styled-components";

const Cell = styled.th`
  padding: 10px;
  
  :hover{
  //TODO : fix them to proper hex colors
  color: black;
  background: white;
  }
`;

const Input = styled.input.attrs({ type: "text" })`
  
  ::-webkit-input-placeholder {
    font-size: 75%;
    color: #b0b0b0;
  }
`;


export default class FilterCell extends React.Component {
    render() {
        return (
            <Cell>
                <Input
                    onChange={event => this.props.onChange(event.target.value)}
                    placeholder={this.props.placeholder}
                />
            </Cell>
        );
    }
}
