import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";

const Container = styled.div`
  margin: 3%;
  padding: 3%;
  border: #839595 3px solid;
  border-radius: 10px;`;

export default class PatientSection extends React.Component {
    render() {
        return (
            <Container>
                There will be two boxes here
            </Container>
        );
    }
}