import React from "react";
import "./patientsTable.css";
import PatientRow from "./patientRow";
import FilterCell from "./filterCell";

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
                <thead>
                    <tr>
                        <th className={"text-left"}>Patient number</th>
                        <th className={"text-left"}>Patient name</th>
                        <th className={"text-left"}>Patient surname</th>
                        <th className={"text-left"}>Patient email</th>
                        <th className={"text-left"}>Patient phone</th>
                    </tr>
                </thead>
                <tbody className={"table-hover"}>
                    <tr>
                        <FilterCell
                            onChange={value => this.number_filter(value)}
                            placeholder={"Search for patient numbers ..."}
                        />
                        <FilterCell
                            onChange={value => this.name_filter(value)}
                            placeholder={"Search for patient names ..."}
                        />
                        <FilterCell
                            onChange={value => this.surname_filter(value)}
                            placeholder={"Search for patients surnames ..."}
                        />
                        <FilterCell
                            onChange={value => this.email_filter(value)}
                            placeholder={"Search for patients emails ..."}
                        />
                        <FilterCell
                            onChange={value => this.phone_filter(value)}
                            placeholder={"Search for patients phones ..."}
                        />
                    </tr>
                    {this.allPatients.map(patient => (
                        <PatientRow
                            patient_no = {patient.patient_no}
                            patient_name = {patient.patient_name}
                            patient_surname = {patient.patient_surname}
                            patient_email = {patient.patient_email}
                            patient_phone = {patient.patient_phone}
                        />
                    ))}
                </tbody>
            </table>
        );
    }
}

export default PatientsTable;
