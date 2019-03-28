/**
 * Class renders content of modal that is used for editing patient.
 *
 * @author Jakub Cerven
 */

import React, { Component } from "react";
import styled from "styled-components";

import PatientSection from "./profileSections/PatientSection";
import CarerSection from "./profileSections/CarerSection";
import HospitalSection from "./profileSections/HospitalSection";
import TestSection from "./profileSections/TestSection";
import AdditionalInfoSection from "./profileSections/AdditionalInfoSection";
import OptionSwitch from "./../switch/OptionSwitch"

import {getServerConnect} from "../../serverConnection";
import {emptyCheck, emailCheck} from "../../lib/inputChecker";
import {openAlert} from "../Alert";


const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 130px);
  overflow: scroll;
  flex-direction: column;
  background: white;
  align-items: center;

  ::-webkit-scrollbar:vertical {
    display: initial;
  }
`;

const PatientProfileTitle = styled.p`
  text-align: center;
  width: auto;
  font-size: 170%;
  color: #eee;
  background-color: #0d4e56;
  padding: 5px;
  margin: 0;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  margin-top: 2%;
`;

const DeleteButton = styled.button`
  border: none;
  background-color: #f44336;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  margin: 2%;

  height: 44px;
  min-width: 100px;
  cursor: pointer;
  :hover {
    background-color: #dc2836;
    color: white;
  }
  outline: none;
`;

const CloseButton = styled.button`
  border: none;
  background-color: #e7e7e7;
  color: black;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;

  height: 44px;
  min-width: 100px;
  margin: 2%;
  cursor: pointer;
  :hover {
    background: #c8c8c8;
    color: black;
  }
  outline: none;
`;

const SaveButton = styled.button`
  border: none;
  background-color: #0b999d;
  color: white;
  text-align: center;
  text-decoration: none;
  margin: 2%;
  border-radius: 5px;

  height: 44px;
  min-width: 100px;
  cursor: pointer;
  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
`;

const SwitchContainer = styled.div`
  margin-top: 3%;
  padding-left: 8px;
`;

const Hr = styled.hr`
  border: 0;
  clear: both;
  width: 90%;
  background-color: #839595;
  height: 1px;
  margin-top: 1%;
  margin-bottom: 1%;
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

    /**
     * Deletes patient and closes modal, if patient is not deleted displays alert.
     */
    deletePatient = () => {
        this.serverConnect.deletePatient(this.state.patientId, this.state.editToken, res => {
            if (res.success){
                openAlert("Patient successfully deleted.", "confirmationAlert",
                "OK", () => {
                    this.props.closeModal();
                });
            }else{
                this.props.handleError(res);
            }
        });
    };

    /**
     * Opens alert asking user if patient should be deleted.
     */
    deleteOption = () => {
        openAlert("Are you sure you want to delete this patient?", "optionAlert", "Yes", this.deletePatient, "No", () => {return});
    };

    /**
     * Display alert and calls deleteTest upon being called.
     * @param testId of test to be deleted
     */
    onDeleteTestClick = testId => {
        openAlert("Are you sure you want to delete this test?", "optionAlert", "Yes", () => {this.deleteTest(testId)}, "No", () => {return});
    };

    /**
     * Unscheduled test.
     * @param testId of test to be deleted
     */
    deleteTest = testId => {
        this.serverConnect.requestTestEditing(testId, res => {
            if (res.token){
                this.serverConnect.unscheduleTest(testId, res.token, res2 => {
                    if (res2.success){
                        this.loadTests();
                        openAlert("Test successfully deleted.", "confirmationAlert", "OK", () => {return});
                    }else{
                        openAlert("Something went wrong.", "confirmationAlert", "OK", () => {return});
                    }
                });
            }else{
                this.props.handleError(res, "Somebody is currently editing this test.")
            }
        });
    };

    /**
     * Loads patient info.
     */
    loadPatient() {
        this.serverConnect.getFullPatientInfo(this.state.patientId, res => {
            if (res.success) {
                const info = res.response[0];
                console.log(info);
                this.setState({
                    patientName: info.patient_name,
                    patientSurname: info.patient_surname,
                    patientEmail: info.patient_email,
                    patientPhone: info.patient_phone,
                    carerId: info.carer_id,
                    carerRelationship: info.relationship,
                    carerName: info.carer_name,
                    carerSurname: info.carer_surname,
                    carerEmail: info.carer_email,
                    carerPhone: info.carer_phone,
                    hospitalId: info.hospital_id,
                    hospitalName: info.hospital_name,
                    hospitalEmail: info.hospital_email,
                    hospitalPhone: info.hospital_phone,
                    isAdult: info.isAdult,
                    additionalInfo: info.additional_info,

                    noCarer: !info.carer_id,
                    localHospital: !info.hospital_id,
                    ready: true
                });
            } else {
                this.props.handleError(res);
            }
        });
    }

    /**
     * Loads patient tests.
     */
    loadTests() {
        this.serverConnect.getNextTestsOfPatient(this.state.patientId, res => {
            if (res.success){
                const tests = res.response;
                this.setState({
                    testsData: tests,
                    readyTest: true
                })
            }else{
                this.props.handleError(res);
            }
        });
    }

    /**
     * Checks if new data of patient are valid.
     * @returns {*} if values are correct and message to display if not
     */
    checkValues () {
        if (emptyCheck(this.state.patientName) || emptyCheck(this.state.patientSurname)) {
            return {correct: false, message: "Please provide patient name and surname."};
        }
        if (!emailCheck(this.state.patientEmail)) {
            return {correct: false, message: "Invalid format of the patient's email."};
        }
        if (!this.state.noCarer) {
            if (emptyCheck(this.state.carerEmail)) {
                return {correct: false, message: "Please provide the carer's email."};
            }
            if (!emailCheck(this.state.carerEmail)) {
                return {correct: false, message: "Invalid format of the carer's email."};
            }

        }
        if (!this.state.localHospital) {
            if (emptyCheck(this.state.hospitalEmail)){
                return {correct: false, message: "Please provide the hospital's email."};
            }
            if (!emailCheck(this.state.hospitalEmail)) {
                return {correct: false, message: "Invalid format of the hospital's email."};
            }

        }
        return {correct : true};
    }

    /**
     * Saves new patient data.
     */
    onSaveClick = () => {
        const result = this.checkValues();
        if (!result.correct) {
            openAlert(result.message, "confirmationAlert", "OK");
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

        const {patientId, editToken, patientName, patientSurname, patientEmail, patientPhone, isAdult, additionalInfo} = this.state;
        let newInfo = {
            patient_no: patientId, patient_name: patientName, patient_surname: patientSurname, patient_email: patientEmail, patient_phone: patientPhone,
            hospital_id: hospitalInfo.hospitalId, hospital_name: hospitalInfo.hospitalName, hospital_email: hospitalInfo.hospitalEmail, hospital_phone: hospitalInfo.hospitalPhone,
            carer_id: carerInfo.carerId, carer_name: carerInfo.carerName, carer_surname: carerInfo.carerSurname, carer_email: carerInfo.carerEmail, carer_phone: carerInfo.carerPhone,
            relationship: carerInfo.carerRelationship, isAdult: isAdult, additional_info: additionalInfo
        };
        console.log(newInfo);

        this.serverConnect.editPatient(patientId, newInfo, editToken, res => {
            if (res.success) {
                openAlert("Patient details updated successfully.", "confirmationAlert", "OK", () => {this.props.closeModal()});
            } else {
                this.props.handleError(res);
            }
        });
    };

    render() {
        if (this.state.ready && this.state.readyTest) {
            return (
              <>
                <PatientProfileTitle>{this.props.purpose}</PatientProfileTitle>
                <Container>
                    <div style ={{height: "auto", width: "auto", "margin-top":" 10px"}}>
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
                    </div>
                    <div style ={{height: "auto", width: "100%"}}>
                    <Hr/>
                    </div>
                    <div style ={{height: "auto", width: "auto"}}>
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
                    </div>
                    <div style ={{height: "auto", width: "100%"}}>
                    <Hr/>
                    </div>
                    <div style ={{height: "auto", width: "auto"}}>
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
                    </div>
                    <div style ={{height: "auto", width: "100%"}}>
                    <Hr/>
                    </div>
                    <div style ={{height: "auto", width: "auto"}}>
                    <TestSection
                        tests={this.state.testsData}
                        deleteTest={this.onDeleteTestClick}
                    />
                    </div>
                    <div style ={{height: "auto", width: "100%"}}>
                    <Hr/>
                    </div>
                    <div style ={{height: "auto", width: "auto"}}>
                    <AdditionalInfoSection
                        additionalInfo={this.state.additionalInfo}
                        onChange={additionalInfo => {
                            this.setState({
                                additionalInfo: additionalInfo.additionalInfo
                            })
                        }}
                    />
                    </div>
                    <div style ={{height: "auto", width: "100%"}}>
                    <Hr/>
                    </div>
                    <SwitchContainer>
                        <OptionSwitch
                            option1={"Under 12"}
                            option2={"12 or older"}
                            checked={this.state.isAdult === "yes"}
                            onChange={() => this.setState(prevState => ({isAdult: prevState.isAdult === "yes" ? "no" : "yes"}))}
                        />
                    </SwitchContainer>
                    <ButtonContainer>
                        <SaveButton onClick={this.onSaveClick}>Save changes</SaveButton>
                        <DeleteButton onClick={this.deleteOption}>Delete patient</DeleteButton>         
                        <CloseButton onClick={this.props.closeModal}>Close</CloseButton>
                    </ButtonContainer>

                </Container>
              </>
            );
        }else {
            return "";
        }
    }
}

export default PatientProfile;
