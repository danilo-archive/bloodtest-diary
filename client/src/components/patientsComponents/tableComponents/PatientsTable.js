import React from "react";
import styled from 'styled-components';

import PatientRow from "./PatientRow.js";
import FilterCell from "./FilterCell.js";
import {getServerConnect} from "../../../serverConnection.js";

const Table = styled.table`
  width: 100%;
  height: 100%;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
   display: table;
   width: 100%;
`;

const TableBody = styled.tbody`
    display: block;
    max-height: 80%; //change this to increase height of table
    overflow-y: scroll;
`;

const TableHead = styled.th`
    width: 16.66%;  //TODO : change this to number of 100/columns
    padding: 10px;
    //word-break: break-all;
    color: white;
    background: #0b989d;
    text-align: left;
`;

const TableRow = styled.tr`
    display: table;
    width: 100%;
    box-sizing: border-box;
`;

class PatientsTable extends React.Component {

    constructor(props){
        super(props);
    }



    number_filter = value => {
        this.props.filterNumber(value);
    };

    name_filter = value => {
        this.props.filterName(value);
    };

    surname_filter = value => {
        this.props.filterSurname(value);
    };

    email_filter = value => {
        this.props.filterEmail(value);
    };

    phone_filter = value => {
        this.props.filterPhone(value);
    };

    render() {
        //TODO : change class names
        return (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Patient number</TableHead>
                    <TableHead>Patient name</TableHead>
                    <TableHead>Patient surname</TableHead>
                    <TableHead>Patient email</TableHead>
                    <TableHead>Patient phone</TableHead>
                    <TableHead></TableHead>
                </TableRow>
                <TableRow>
                    <FilterCell
                        onChange={value => this.number_filter(value)}
                        placeholder={"Search numbers ..."}
                    />
                    <FilterCell
                        onChange={value => this.name_filter(value)}
                        placeholder={"Search names ..."}
                    />
                    <FilterCell
                        onChange={value => this.surname_filter(value)}
                        placeholder={"Search surnames ..."}
                    />
                    <FilterCell
                        onChange={value => this.email_filter(value)}
                        placeholder={"Search emails ..."}
                    />
                    <FilterCell
                        onChange={value => this.phone_filter(value)}
                        placeholder={"Search phones ..."}
                    />
                    <FilterCell
                    />
                </TableRow>
                </TableHeader>
                <TableBody>
                {this.props.shownPatients.map(patient => (
                    <PatientRow
                        key={patient.patient_no}
                        patient_no = {patient.patient_no}
                        patient_name = {patient.patient_name}
                        patient_surname = {patient.patient_surname}
                        patient_email = {patient.patient_email}
                        patient_phone = {patient.patient_phone}
                        openModal = {this.props.openModal}
                    />
                ))}
                </TableBody>
            </Table>
        );
    }
}

export default PatientsTable;
