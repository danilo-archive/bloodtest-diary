import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";

const Container = styled.div`
  margin: 3%;
  padding: 1%;
  border: #839595 3px solid;
  border-radius: 10px;
`;


export default class PatientSection extends React.Component {
    render() {
        return (
            <Container>
                <InfoCell
                    field={"Patient ID"}
                    value={"some value"}
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
            </Container>
        );
    }
}