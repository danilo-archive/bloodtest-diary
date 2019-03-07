import React from "react";
import styled from 'styled-components';

import "./patientsTable.css";
import PatientRow from "./patientRow";
import FilterCell from "./filterCell";

const Scrollable = styled.div`
   
`;

class PatientsTable extends React.Component {

    constructor(props){
        super(props);

        this.allPatients = this.props.allPatients;
    }

    number_filter = value => {
        this.allPatients = this.props.allPatients.filter(
         patient => patient.patient_no.includes(value)
        );
        this.forceUpdate()
    };

    name_filter = value => {
        this.allPatients = this.props.allPatients.filter(
            patient => patient.patient_name.includes(value)
        );
        this.forceUpdate()
    };

    surname_filter = value => {
        this.allPatients = this.props.allPatients.filter(
            patient => patient.patient_surname.includes(value)
        );
        this.forceUpdate()
    };

    email_filter = value => {
        this.allPatients = this.props.allPatients.filter(
            patient => patient.patient_email.includes(value)
        );
        this.forceUpdate()
    };

    phone_filter = value => {
        this.allPatients = this.props.allPatients.filter(
            patient => patient.patient_phone.includes(value)
        );
        this.forceUpdate()
    };

    render() {
        //TODO : change class names
        return (
            <table className="table-fill">
                <thead className={"table-head"}>
                    <tr className={"table-row"}>
                        <th>Patient number</th>
                        <th>Patient name</th>
                        <th>Patient surname</th>
                        <th>Patient email</th>
                        <th>Patient phone</th>
                    </tr>
                    <tr>
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
                    </tr>
                </thead>
                <thead className={"table-hover"}>
                    {this.allPatients.map(patient => (
                        <PatientRow
                            patient_no = {patient.patient_no}
                            patient_name = {patient.patient_name}
                            patient_surname = {patient.patient_surname}
                            patient_email = {patient.patient_email}
                            patient_phone = {patient.patient_phone}
                        />
                    ))}
                </thead>
            </table>
        );
    }
}

export default PatientsTable;
