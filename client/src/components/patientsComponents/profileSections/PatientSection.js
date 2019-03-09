import React from "react";
import styled from "styled-components";

import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer"

export default class PatientSection extends React.Component {
    render() {
        const content = (
            <>
                <InputCell
                    field={"Patient id"}
                    id={"patient_id"}
                    value={this.props.patientId}
                />

                <InputCell
                    field={"Name"}
                    id={"patient_name"}
                    value={this.props.patientName}
                />
                <InputCell
                    field={"Surname"}
                    id={"patient_surname"}
                    value={this.props.patientSurname}
                />
                <InputCell
                    field={"Email"}
                    id={"patient_email"}
                    value={this.props.patientEmail}
                />
                <InputCell
                    field={"Phone"}
                    id={"patient_phone"}
                    value={this.props.patientPhone}
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