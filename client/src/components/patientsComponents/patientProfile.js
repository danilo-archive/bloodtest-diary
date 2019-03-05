import React from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import TestSection from "./profileSections/TestSection";


const Container = styled.div`
  width: 80%;
  height: 80%;
`;


export default class PatientProfile extends React.Component {
    render() {
        return (
            <>
                <Container>
                    <PatientSection/>
                    <CarerSection/>
                    <HospitalSection/>
                    <TestSection/>
                </Container>
            </>
        );
    }
}