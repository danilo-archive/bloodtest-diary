import React from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import TestSection from "./profileSections/TestSection";


const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background: #f5f5f5;
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
    background: #c8c8c8;
    color: black;
  }
`;

const SaveButton = styled.button`
  border: none;
  background-color: #f44336;
  color: white;
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
    background-color: #dc2836;
    color: white;
  }
`;



export default class PatientProfile extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        patientId: props.patientId
      }
    }


    render() {
        return (
            <Container>
                <PatientSection
                  patientId={this.state.patientId}
                />
                <CarerSection/>
                <HospitalSection/>
                <TestSection tests={[{due_date:"2019-02-02", notes: "Some notes"}]}/>

                <ButtonContainer>
                    <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
                    <SaveButton>Save changes</SaveButton>
                </ButtonContainer>

            </Container>
        );
    }
}