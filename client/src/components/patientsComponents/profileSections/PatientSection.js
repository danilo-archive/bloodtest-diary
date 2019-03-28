/**
 * Class renders patient info section of patient.
 *
 * @author Jakub Cerven
 */

import React from "react";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer"

export default class PatientSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailFormat: true,
            phoneFormat: true
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.editable = !this.props.editable;
    }

    /**
     * Stores values of input fields.
     */
    onInputChange() {
        const patientId = document.getElementById("patient_id").value;
        const patientName = document.getElementById("patient_name").value;
        const patientSurname = document.getElementById("patient_surname").value;
        const patientEmail = document.getElementById("patient_email").value;
        const patientPhone = document.getElementById("patient_phone").value;

        this.props.onChange({patientId, patientName, patientSurname, patientEmail, patientPhone});
    }

    render() {
        const content = (
            <>
                <InputCell
                    field={"Patient number:"}
                    id={"patient_id"}
                    disabled={this.editable}
                    value={this.props.patientId}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Name:"}
                    id={"patient_name"}
                    value={this.props.patientName}
                    onChange={this.onInputChange}
                />
                <InputCell
                    field={"Surname:"}
                    id={"patient_surname"}
                    value={this.props.patientSurname}
                    onChange={this.onInputChange}
                />
                <InputCell
                    field={"Email:"}
                    id={"patient_email"}
                    value={this.props.patientEmail}
                    onChange={this.onInputChange}
                    placeholder={"(optional)"}
                />
                <InputCell
                    field={"Phone:"}
                    id={"patient_phone"}
                    value={this.props.patientPhone}
                    onChange={this.onInputChange}
                    placeholder={"(optional)"}
                />
        </>
        );
        return (
            <SectionContainer
                title={"Patient details"}
                content={content}
            />
        );
    }
}