import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";

export default class PatientSection extends React.Component {
    render() {
        return (
            <>
                <InfoCell
                    field={"Patient ID : "}
                    value={"some value"}
                />

                <InputCell
                    field={"Patient ID : "}
                    value={"some value"}
                />

                <InputCell
                    field={"Patient ID : "}
                    value={"some value"}
                />

                <InputCell
                    field={"Patient ID : "}
                    value={"some value"}
                />
            </>
        );
    }
}