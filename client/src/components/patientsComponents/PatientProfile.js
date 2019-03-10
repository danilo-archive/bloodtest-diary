import React, {Component} from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import TestSection from "./profileSections/TestSection";
import {getServerConnect} from "../../serverConnection";


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


class PatientProfile extends Component {

    constructor(props){
      super(props);
      this.state = {
        patientId: props.patientId,
        editToken: props.editToken,
        patientInfo: undefined,
        ready: false
      };
      this.serverConnect = getServerConnect();

      console.log(props.patientId);
      this.loadPatient();
    }

    loadPatient() {
        this.serverConnect.getFullPatientInfo(this.state.patientId, response => {
           const info = response[0];
           this.setState({
               patientName : info.patient_name,
               patientSurname : info.patient_surname,
               patientEmail : info.patient_email,
               patientPhone : info.patient_phone,
               carerId : info.carer_id,
               carerRelationship: info.relationship,
               carerName: info.carer_name,
               carerSurname: info.carer_surname,
               carerEmail: info.carer_email,
               carerPhone: info.carer_phone,
               hospitalId: info.hospital_id,
               hospitalName: info.hospital_name,
               hospitalEmail: info.hospital_email,
               hospitalPhone: info.hospital_phone,

               hasCarer: info.carer_id ? true : false,
               localHospital: info.hospital_id ? false : true,
               ready: true
               //TODO : store patients tests
           });
        });
    }

    render() {
        if (this.state.ready) {
            return (
                <Container>
                    <PatientSection
                        patientId={this.state.patientId}
                        patientName={this.state.patientName}
                        patientSurname={this.state.patientSurname}
                        patientEmail={this.state.patientEmail}
                        patientPhone={this.state.patientPhone}
                    />
                    <CarerSection
                        carerId={this.state.carerId}
                        carerRelationship={this.state.carerRelationship}
                        carerName={this.state.carerName}
                        carerSurname={this.state.carerSurname}
                        carerEmail={this.state.carerEmail}
                        carerPhone={this.state.carerPhone}
                        hasCarer={this.state.hasCarer}
                        onCarerClick={() => this.setState({hasCarer: !this.state.hasCarer})}
                    />
                    <HospitalSection
                        hospitalId={this.state.hospitalId}
                        hospitalName={this.state.hospitalName}
                        hospitalEmail={this.state.hospitalEmail}
                        hospitalPhone={this.state.hospitalPhone}
                        localHospital={this.state.localHospital}
                        //TODO : maybe find different way of doing this
                        onHospitalClick={() => this.setState({localHospital: !this.state.localHospital})}
                    />
                    <TestSection tests={[{due_date: "2019-02-02", notes: "Some notes"}]}/>

                    <ButtonContainer>
                        <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
                        <SaveButton>Save changes</SaveButton>
                    </ButtonContainer>

                </Container>
            );
        }else {
            return "";
        }
    }
}

export default PatientProfile;