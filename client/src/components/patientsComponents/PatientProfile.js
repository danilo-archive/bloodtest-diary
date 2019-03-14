import React, {Component} from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import TestSection from "./profileSections/TestSection";
import {getServerConnect} from "../../serverConnection";
import {openAlert} from "../Alert";


const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background: #f5f5f5;
  align-items: center;
  font-family: "Rajdhani",sans-serif;
`;

const PatientProfileTitle = styled.p`
  text-align: center;
  font-size: 175%;
  font-weight: bold;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
`;

const DeleteContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const DeleteButton = styled.button`
  border: none;
  background-color: #f44336;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #dc2836;
    color: white;
    border-radius: 10px;
  }
  outline: none;
`;

const CloseButton = styled.button`
  border: none;
  background-color: #e7e7e7;
  color: black;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;
  margin: 4%;

  :hover {
    background: #c8c8c8;
    color: black;
    border-radius: 10px;
  }
  outline: none;
`;

const SaveButton = styled.button`
  border: none;
  background-color: #0b999d;
  color: white;
  text-align: center;
  text-decoration: none;
  margin: 4%;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
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

      this.loadPatient();
      this.loadTests();
    }

    deletePatient() {
        console.log("i am deleting patient");
    }

    deleteOption () {
        openAlert("Are you sure you want to delete this patient ?", "optionAlert", "Yes", this.deletePatient, "No", () => {return});
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

               noCarer: info.carer_id ? false : true,
               localHospital: info.hospital_id ? false : true,
               ready: true
               //TODO : store patients tests
           });
        });
    }

    loadTests() {
        this.serverConnect.getNextTestsOfPatient(this.state.patientId, response => {
            const tests = response.response;
            this.setState({
                testsData: tests,
                readyTest: true
            })
        });
    }

    onSaveClick = () => {
        let carerInfo = undefined;
        let hospitalInfo = undefined;
        if (!this.state.noCarer){
            if (this.state.carerEmail === "" || this.state.carerEmail === undefined){
                // TODO add UI alert
                openAlert("Carer's email is compulsory", "confirmationAlert", "Ok");
                return;
            }
            carerInfo = {
                carerId: this.state.carerId,
                carerRelationship: this.state.carerRelationship,
                carerName: this.state.carerName,
                carerSurname: this.state.carerSurname,
                carerEmail: this.state.carerEmail,
                carerPhone: this.state.carerPhone
            }
        }else{
            carerInfo = {
                carerId: undefined
            }
        }
        if (!this.state.localHospital){
            if (this.state.hospitalEmail === "" || this.state.hospitalEmail === undefined){
                openAlert("Hospital's email is compulsory","confirmationAlert", "Ok");
                return;
            }
            hospitalInfo = {
                hospitalId: this.state.hospitalId,
                hospitalName: this.state.hospitalName,
                hospitalEmail: this.state.hospitalEmail,
                hospitalPhone: this.state.hospitalPhone
            }
        }else{
            hospitalInfo = {
                hospitalId: undefined
            }
        }

        const {patientId, editToken, patientName, patientSurname, patientEmail, patientPhone} = this.state;
        let newInfo = {
            patient_no: patientId, patient_name: patientName, patient_surname: patientSurname, patient_email: patientEmail, patient_phone: patientPhone,
            hospital_id: hospitalInfo.hospitalId, hospital_name: hospitalInfo.hospitalName, hospital_email: hospitalInfo.hospitalEmail, hospital_phone: hospitalInfo.hospitalPhone,
            carer_id: carerInfo.carerId, carer_name: carerInfo.carerName, carer_surname: carerInfo.carerSurname, carer_email: carerInfo.carerEmail, carer_phone: carerInfo.carerPhone,
            relationship: carerInfo.carerRelationship
        };
        console.log({newInfo});
        this.serverConnect.editPatient(patientId, newInfo, editToken, res => {
            if (res.success) {
                openAlert("Patient edited successfully", "confirmationAlert", "Ok", () => {this.props.closeModal()});
            } else {
                openAlert("An error occurred while editing patient", "confirmationAlert", "Ok");
            }
        });
    };



    render() {
        if (this.state.ready && this.state.readyTest) {
            return (
                <Container>
                    <PatientProfileTitle>{this.props.purpose}</PatientProfileTitle>
                    <PatientSection
                        patientId={this.state.patientId}
                        patientName={this.state.patientName}
                        patientSurname={this.state.patientSurname}
                        patientEmail={this.state.patientEmail}
                        patientPhone={this.state.patientPhone}
                        onChange={patient => {
                            this.setState({
                                patientName: patient.patientName,
                                patientSurname: patient.patientSurname,
                                patientEmail: patient.patientEmail,
                                patientPhone: patient.patientPhone
                            })
                        }}
                    />
                    <CarerSection
                        carerId={this.state.carerId}
                        carerRelationship={this.state.carerRelationship}
                        carerName={this.state.carerName}
                        carerSurname={this.state.carerSurname}
                        carerEmail={this.state.carerEmail}
                        carerPhone={this.state.carerPhone}
                        noCarer={this.state.noCarer}
                        onCarerClick={() => this.setState({noCarer: !this.state.noCarer})}
                        onChange={carer => {
                            this.setState({
                                carerRelationship: carer.carerRelationship,
                                carerName: carer.carerName,
                                carerSurname: carer.carerSurname,
                                carerEmail: carer.carerEmail,
                                carerPhone: carer.carerPhone
                            })
                        }}
                    />
                    <HospitalSection
                        hospitalId={this.state.hospitalId}
                        hospitalName={this.state.hospitalName}
                        hospitalEmail={this.state.hospitalEmail}
                        hospitalPhone={this.state.hospitalPhone}
                        localHospital={this.state.localHospital}
                        //TODO : maybe find different way of doing this
                        onHospitalClick={() => this.setState({localHospital: !this.state.localHospital})}
                        onChange={hospital => {
                            this.setState({
                                hospitalName: hospital.hospitalName,
                                hospitalEmail: hospital.hospitalEmail,
                                hospitalPhone: hospital.hospitalPhone
                            })
                        }}
                    />
                    <TestSection tests={this.state.testsData}/>

                    <ButtonContainer>
                        <DeleteContainer>
                            <DeleteButton onClick={this.deleteOption}>Delete patient</DeleteButton>
                        </DeleteContainer>
                        <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
                        <SaveButton onClick={this.onSaveClick}>Save changes</SaveButton>
                    </ButtonContainer>

                </Container>
            );
        }else {
            return "";
        }
    }
}

export default PatientProfile;
