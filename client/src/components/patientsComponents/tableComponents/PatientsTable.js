/**
 * Class renders Table with patient data.
 *
 * @author Jakub Cerven
 */

import React from "react";
import styled from 'styled-components';

import PatientRow from "./PatientRow.js";
import FilterCell from "./FilterCell.js";

const TableContainer = styled.div`
  padding: 0.5%;
  width: 100%;
  height: 93.6%; //exact size as home
  background: #ffffff;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  overflow: hidden;
`;

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
    max-height: 87%; 
    overflow-y: scroll;
    
    ::-webkit-scrollbar:vertical {
      display: initial;
    }
    
`;

const TableHead = styled.th`
    width: 16.66%;  //TODO : change this to number of 100/columns
    padding: 10px;
    //word-break: break-all;
    color: white;
    background: #0d4e56;
    text-align: left;
    font-weight: normal;
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
        return (
            <TableContainer>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Patient number</TableHead>
                        <TableHead>Patient name</TableHead>
                        <TableHead>Patient surname</TableHead>
                        <TableHead>Patient email</TableHead>
                        <TableHead>Patient phone</TableHead>
                        <TableHead/>
                    </TableRow>
                    <TableRow>
                        <FilterCell
                            onChange={value => this.number_filter(value)}
                            placeholder={"Search numbers..."}
                        />
                        <FilterCell
                            onChange={value => this.name_filter(value)}
                            placeholder={"Search names..."}
                        />
                        <FilterCell
                            onChange={value => this.surname_filter(value)}
                            placeholder={"Search surnames..."}
                        />
                        <FilterCell
                            onChange={value => this.email_filter(value)}
                            placeholder={"Search emails..."}
                        />
                        <FilterCell
                            onChange={value => this.phone_filter(value)}
                            placeholder={"Search phones..."}
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
                            openEditModal = {this.props.openEditModal}
                        />
                    ))}
                    <div style={{width:"100%", height: "20px"}}/>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default PatientsTable;
