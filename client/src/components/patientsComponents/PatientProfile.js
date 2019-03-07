import React from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import TestSection from "./profileSections/TestSection";


const Container = styled.div`
`;

const ButtonContainer = styled.div`
  margin-bottom: 3%;
`;

const CloseButton = styled.button`
  border: none;
  background-color: #e7e7e7;
  color: black;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 10%;
  border-radius: 10px;
  margin-left: 35%;
  
  min-height: 40px;
  min-width: 100px;
  
  :hover {
    background: #e7e7e7;
    color: black;
  }
`;

const SaveButton = styled.button`
  border: none;
  background-color: #f44336;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 10%;
  border-radius: 10px;
  
  float: right;
  margin-right: 35%;
  
  min-height: 40px;
  min-width: 100px;
  
  :hover {
    background-color: #f44336;
    color: white;
  }
`;



export default class PatientProfile extends React.Component {
    render() {
        return (
            <Container>
                <PatientSection/>
                <CarerSection/>
                <HospitalSection/>
                <TestSection/>

                <ButtonContainer>
                    <CloseButton>Close</CloseButton>
                    <SaveButton>Save changes</SaveButton>
                </ButtonContainer>

            </Container>
        );
    }
}