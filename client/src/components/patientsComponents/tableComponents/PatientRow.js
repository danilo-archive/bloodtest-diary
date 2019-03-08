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

export default props => {
    return (
        <TableRow>
            <TableData>{props.patient_no}</TableData>
            <TableData>{props.patient_name}</TableData>
            <TableData>{props.patient_surname}</TableData>
            <TableData>{props.patient_email}</TableData>
            <TableData>{props.patient_phone}</TableData>
            <TableData><Button color="info">Edit patient</Button>{' '}</TableData>
        </TableRow>
    );
};
