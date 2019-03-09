import React from "react";
import styled from "styled-components";

import {Button} from 'react-bootstrap';

const TableData = styled.td`
    width: 16.66%;
    padding: 7px;
    word-break: break-all;
    color: black;
    border-collapse: collapse;
    border: 1px solid #ddd;
    border-bottom: none;
    border-left: none;
    :last-child {
      border-right: none;
      text-align: center;
    }
`;

const TableRow = styled.tr`
    display: table;
    width: 100%;
    box-sizing: border-box;
    :hover {background-color: #f5f5f5;}
    :nth-child(even) {background-color: #f2f2f2;}
`;

export default class PatientRow extends React.Component{

    constructor(props){
        super(props);

        //this.onEditClick = this.onEditClick.bind(this);
    }

    onEditClick = event => {
        console.log(`id in row: ${this.props.patient_no}`);
        this.props.openModal(this.props.patient_no);
    }

    render(){
        return (
            <TableRow>
                <TableData>{this.props.patient_no}</TableData>
                <TableData>{this.props.patient_name}</TableData>
                <TableData>{this.props.patient_surname}</TableData>
                <TableData>{this.props.patient_email}</TableData>
                <TableData>{this.props.patient_phone}</TableData>
                <TableData><Button onClick={this.onEditClick} color="info">Edit patient</Button>{' '}</TableData>
            </TableRow>
        );
    }
};
