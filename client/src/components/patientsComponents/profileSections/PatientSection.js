import React from "react";
import styled from "styled-components";

import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer"

export default class PatientSection extends React.Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.editable = !this.props.editable;
    }

    onInputChange() {
        const patientName = document.getElementById("patient_name").value;
        const patientSurname = document.getElementById("patient_surname").value;
        const patientEmail = document.getElementById("patient_email").value;
        const patientPhone = document.getElementById("patient_phone").value;

        this.props.onChange({patientName, patientSurname, patientEmail, patientPhone});
    }

    render() {
        const content = (
            <>
                <InputCell
                    field={"Patient id"}
                    id={"patient_id"}
                    disabled={this.editable}
                    value={this.props.patientId}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Name"}
                    id={"patient_name"}
                    value={this.props.patientName}
                    onChange={this.onInputChange}
                />
                <InputCell
                    field={"Surname"}
                    id={"patient_surname"}
                    value={this.props.patientSurname}
                    onChange={this.onInputChange}
                />
                <InputCell
                    field={"Email"}
                    id={"patient_email"}
                    value={this.props.patientEmail}
                    onChange={this.onInputChange}
                />
                <InputCell
                    field={"Phone"}
                    id={"patient_phone"}
                    value={this.props.patientPhone}
                    onChange={this.onInputChange}
                />
        </>
        );
        return (
            <SectionContainer
                title={"Patient info"}
                content={content}
            />
        );
    }
}