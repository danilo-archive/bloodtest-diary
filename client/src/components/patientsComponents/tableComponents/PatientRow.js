/**
 * Class renders one row of patient data.
 *
 * @author
 */

import React from "react";
import styled from "styled-components";


const TableData = styled.td`
    width: 16.66%;
    padding: 7px;
    word-break: break-all;
    color: black;
    background: white;
`;

const TableRow = styled.tr`
    display: table;
    width: 100%;
    box-sizing: border-box;
    :hover {background-color: #f2f2f2;}
    :nth-child(even) {background-color: #f2f2f2;}
`;

const Button = styled.button`
  border: none;
  color: white;
  padding: 7px 12px;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 120%;
  font-weight: 200;
  background-color: #0b989d;
  word-break: break-word;
  outline: none;
  cursor: pointer;
  :hover {
    background: #018589;
  }
`;

export default class PatientRow extends React.Component{

    onEditClick = event => {
        this.props.openEditModal(this.props.patient_no);
    };

    render(){
        return (
            <TableRow>
                <TableData>{this.props.patient_no}</TableData>
                <TableData>{this.props.patient_name}</TableData>
                <TableData>{this.props.patient_surname}</TableData>
                <TableData>{this.props.patient_email}</TableData>
                <TableData>{this.props.patient_phone}</TableData>
                <TableData><Button onClick={this.onEditClick}>Edit patient</Button></TableData>
            </TableRow>
        );
    }
};
