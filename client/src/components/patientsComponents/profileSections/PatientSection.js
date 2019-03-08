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
                    field={"ID"}
                    value={"some value"}
                    id={"patient_id"}
                    disabled={"true"}
                />
                <InputCell
                    field={"Name"}
                    value={"some value"}
                />
                <InputCell
                    field={"Surname"}
                    value={"some value"}
                />
                <InputCell
                    field={"Email"}
                    value={"some value"}
                />
                <InputCell
                    field={"Phone"}
                    value={"some value"}
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