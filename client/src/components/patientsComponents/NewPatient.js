import React, {Component} from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import {getServerConnect} from "../../serverConnection";
import { openAlert } from "../Alert"
import {emptyCheck, emailCheck} from "../../lib/inputChecker";
import OptionSwitch from "./../switch/OptionSwitch";


const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background: #f5f5f5;
  align-items: center;
  font-family: "Rajdhani",sans-serif;
  padding: 1%;
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
  width: 100%;
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
  margin: 3%;

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
  margin: 3%;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
`;

const SwitchContainer = styled.div`
  margin-top: 2%;
`;

const Hr = styled.hr`
  border: 0;
  clear: both;
  display: block;
  width: 96%;               
  background-color: #839595;
  height: 1px;
`;


class NewPatient extends Component {

    constructor(props){
        super(props);
        this.state = {
            noCarer: true,
            localHospital: true
        };
        this.serverConnect = getServerConnect();

    }

    checkValues () {
        if (emptyCheck(this.state.patientId)) {
            return {correct: false, message: "Patient Id is compulsory"};
        }
        if (this.props.allPatientsId.indexOf(this.state.patientId) > -1) {
            return {correct: false, message: "Patient with this Id already exists"}
        }
        if (emptyCheck(this.state.patientName) || emptyCheck(this.state.patientSurname)) {
            return {correct: false, message: "Patient name and surname are compulsory"};
        }
        if (!emailCheck(this.state.patientEmail)) {
            return {correct: false, message: "Wrong format of patient's email"};
        }

        if (!this.state.noCarer) {
            if (emptyCheck(this.state.carerEmail)) {
                return {correct: false, message: "Carer's email is compulsory"};
            }
            if (!emailCheck(this.state.carerEmail)) {
                return {correct: false, message: "Wrong format of carer's email"};
            }

        }
        if (!this.state.localHospital) {
            if (emptyCheck(this.state.hospitalEmail)){
                return {correct: false, message: "Hospital's email is compulsory"};
            }
            if (!emailCheck(this.state.hospitalEmail)) {
                return {correct: false, message: "Wrong format of hospital's email"};
            }

        }
        return {correct : true};
    }

    onAddClick = () => {
        const result = this.checkValues();
        if (!result.correct) {
            openAlert(result.message, "confirmationAlert", "Ok");
            return;
        }

        let carerInfo = undefined;
        let hospitalInfo = undefined;

        if (!this.state.noCarer) {
            carerInfo = {
                carerId: this.state.carerId,
                carerRelationship: this.state.carerRelationship,
                carerName: this.state.carerName,
                carerSurname: this.state.carerSurname,
                carerEmail: this.state.carerEmail,
                carerPhone: this.state.carerPhone
            }
        } else {
            carerInfo = {
                carerId: undefined
            }
        }
        if (!this.state.localHospital){
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

        const {patientId, patientName, patientSurname, patientEmail, patientPhone} = this.state;
        let newInfo = {
            patient_no: patientId, patient_name: patientName, patient_surname: patientSurname, patient_email: patientEmail, patient_phone: patientPhone,
            hospital_id: hospitalInfo.hospitalId, hospital_name: hospitalInfo.hospitalName, hospital_email: hospitalInfo.hospitalEmail, hospital_phone: hospitalInfo.hospitalPhone,
            carer_id: carerInfo.carerId, carer_name: carerInfo.carerName, carer_surname: carerInfo.carerSurname, carer_email: carerInfo.carerEmail, carer_phone: carerInfo.carerPhone,
            relationship: carerInfo.carerRelationship
        };
        console.log({newInfo});
        this.serverConnect.addPatient(newInfo, res => {
            if (res.success) {
                openAlert("Patient added successfully", "confirmationAlert", "Ok", () => {this.props.closeModal()});
            } else {
                openAlert("An error occurred while adding patient", "confirmationAlert", "Ok");
            }
        });
    };



    render() {
        return (
            <Container>
                <PatientProfileTitle>{this.props.purpose}</PatientProfileTitle>
                <Hr/>
                <PatientSection
                    editable={true}
                    patientId={""}
                    patientName={""}
                    patientSurname={""}
                    patientEmail={""}
                    patientPhone={""}
                    onChange={patient => {
                        this.setState({
                            patientId: patient.patientId,
                            patientName: patient.patientName,
                            patientSurname: patient.patientSurname,
                            patientEmail: patient.patientEmail,
                            patientPhone: patient.patientPhone
                        })
                    }}
                />
                <Hr/>
                <CarerSection
                    carerId={""} //TODO : generate this
                    carerRelationship={""}
                    carerName={""}
                    carerSurname={""}
                    carerEmail={""}
                    carerPhone={""}
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
                <Hr/>
                <HospitalSection
                    hospitalId={""} //TODO : generate this
                    hospitalName={""}
                    hospitalEmail={""}
                    hospitalPhone={""}
                    localHospital={this.state.localHospital}
                    onHospitalClick={() => this.setState({localHospital: !this.state.localHospital})}
                    onChange={hospital => {
                        this.setState({
                            hospitalName: hospital.hospitalName,
                            hospitalEmail: hospital.hospitalEmail,
                            hospitalPhone: hospital.hospitalPhone
                        })
                    }}
                />

                <SwitchContainer>
                    <OptionSwitch
                        option1={"Under 12"}
                        option2={"12 or older"}
                    />
                </SwitchContainer>

                <ButtonContainer>
                    <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
                    <SaveButton onClick={this.onAddClick}>Add patient</SaveButton>
                </ButtonContainer>

            </Container>
        );
    }
}

export default NewPatient;
