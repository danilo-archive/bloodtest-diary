/**
 * Class renders TableHead which servers as filter for given attribute.
 *
 * @author Jakub Cerven
 */

import React from "react";
import styled from "styled-components";

const TableHead = styled.th`
    width: 16.66%;
    padding: 5px;
    word-break: break-all;
    color: black;
    background: white;
`;

const Input = styled.input.attrs({ type: "text" })`
  width: 100%;
  font-weight: 100;
  background-color: inherit;
  ::-webkit-input-placeholder {
    font-size: 80%;
    color: #b0b0b0;
  }
`;


export default class FilterCell extends React.Component {

    render() {
        if (this.props.placeholder !== undefined) {
            return (
                <TableHead>
                    <Input
                        onChange={event => this.props.onChange(event.target.value)}
                        placeholder={this.props.placeholder}
                    />
                </TableHead>
            );
        } else return (
            <TableHead>
            </TableHead>
        );
    }
}
