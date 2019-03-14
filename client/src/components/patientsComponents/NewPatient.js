import React, {Component} from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import {getServerConnect} from "../../serverConnection";
import { openAlert } from "../Alert"


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
  margin-right: 2%;

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
  margin-left: 2%;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
`;


class NewPatient extends Component {

    constructor(props){
        super(props);
    }

    onAddClick = () => {
        let carerInfo = undefined;
        let hospitalInfo = undefined;
        if (this.state.patientId === "" || this.state.patientId === undefined) {
            openAlert("Patient Id is compulsory", "confirmationAlert", "Ok");
            return;
        }

        if (this.state.patientName === "" || this.state.patientName === undefined || this.state.patientSurname === "" || this.state.patientSurname === undefined) {
            openAlert("Patient name and surname are compulsory", "confirmationAlert", "Ok");
            return;
        }
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
                openAlert("Hospital's email is compulsory", "confirmationAlert", "Ok");
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

        const {patientId, patientName, patientSurname, patientEmail, patientPhone} = this.state;
        let newInfo = {
            patient_no: patientId, patient_name: patientName, patient_surname: patientSurname, patient_email: patientEmail, patient_phone: patientPhone,
            hospital_id: hospitalInfo.hospitalId, hospital_name: hospitalInfo.hospitalName, hospital_email: hospitalInfo.hospitalEmail, hospital_phone: hospitalInfo.hospitalPhone,
            carer_id: carerInfo.carerId, carer_name: carerInfo.carerName, carer_surname: carerInfo.carerSurname, carer_email: carerInfo.carerEmail, carer_phone: carerInfo.carerPhone,
            relationship: carerInfo.carerRelationship
        };
        console.log({newInfo});
        //TODO : save patient
        /*this.serverConnect.editPatient(patientId, newInfo, editToken, res => {
            alert(`-- success = ${res.success}`);
            this.props.closeModal();
        });*/
    };



    render() {
        return (
            <Container>
                <PatientProfileTitle>{this.props.purpose}</PatientProfileTitle>
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

                <ButtonContainer>
                    <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
                    <SaveButton onClick={this.onAddClick}>Add patient</SaveButton>
                </ButtonContainer>

            </Container>
        );
    }
}

export default NewPatient;
