import React, { Component } from "react";
import styled from "styled-components";
import { ModalProvider } from "styled-react-modal";
import Modal from "./PatientModal";

import Navbar from "./homeComponents/navbar";
import PatientsTable from "./patientsComponents/tableComponents/PatientsTable";

import LoadingAnimation from "./loadingScreen/loadingAnimation";

import {getServerConnect} from "../serverConnection.js";
import PatientProfile from "./patientsComponents/PatientProfile";
import NewPatient from "./patientsComponents/NewPatient";
import {openAlert} from "./Alert";

const Container = styled.div`
  border: blue 0 solid;
  height: calc(103vh - 88px);
  width: auto;
  position: relative;
  top: 20px;
  padding: 1% 1% 1% 1%;

  background: rgb(244,249,253);

  display: flex;
  flex-direction: column;
`;


const TableContainer = styled.div`
    height: auto;
    width: auto;
    display: flex;
    flex-grow: 5;
    flex-shrink: 1;
`;

const modalStyles = {
  border: `solid 0 black`
};

class Patients extends React.Component {
  constructor(props) {
    super(props);
    this.onHomeClick = this.onHomeClick.bind(this);
    this.serverConnect = getServerConnect();
    this.serverConnect.joinPatientsPage();

    this.state = {
      under12: this.serverConnect.isUnderTwelve(),
      allPatientsReady: false,
      allPatients: {},
      shownPatients: {},
      openEditModal: false,
      openAddModal: false,
      selectedId: undefined
    };
    this.initOnPatientEditedCallback();
    this.initAllPatients();
  }

  refresh = event => {
    this.initAllPatients();
  };

    handleError = (res, error) => {
        if (res.errorType === "authentication"){
            openAlert("Authentication failed.", "confirmationAlert", "Go back to login", () => {this.logout()});
        }else{
            openAlert(`${error ? error : "Unknown error occurred."}`, "confirmationAlert", "OK", () => {return});
        }
    };

    initAllPatients(){
        this.serverConnect.getAllPatients(res => {
            if (res.success){
                this.setState({
                    allPatients: res.response,
                    shownPatients: res.response,
                    allPatientsReady: true
                });
            }else{
                openAlert("Authentication failed", "confirmationAlert", "Go back to login", () => {this.logout()});
            }
        });
    };

    initOnPatientEditedCallback(){
        this.serverConnect.setOnPatientEdited((patientId, newInfo) => {
            this.initAllPatients();
        });
    }

    number_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_no.toLowerCase().includes(value.toLowerCase())
              )
            });
        }
    };

    name_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_name ? patient.patient_name.toLowerCase().includes(value.toLowerCase()) : false
              )
            });
        }
    };

    surname_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_surname ? patient.patient_surname.toLowerCase().includes(value.toLowerCase()) : false
              )
            });
        }
    };

    email_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_email ? patient.patient_email.toLowerCase().includes(value.toLowerCase()) : false
              )
            });
        }
    };

    phone_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_phone ? patient.patient_phone.toLowerCase().includes(value.toLowerCase()) : false
              )
            });
        }
    };

    onHomeClick = event => {
        this.props.history.push("home")
    };

    logout = event => {
      this.serverConnect.logout(res => {
          this.props.history.replace("");
      });
    };


    openEditModal = id => {
        this.serverConnect.requestPatientEditing(id, res => {
            if (res.token){
                this.setState({selectedId: id, openEditModal: true, editToken: res.token});
            }else{
                this.handleError(res, "Somebody is already editing this patient");
            }
        });
    };


    onCloseEditModal = () => {
        this.serverConnect.discardPatientEditing(this.state.selectedId, this.state.editToken, res => {
            this.setState({selectedId: undefined, openEditModal: false, editToken: undefined});
        });
    };

    openAddModal = () => {
        this.setState({openAddModal: true});
    };

    onCloseAddModal = () => {
        this.setState({openAddModal: false})
    };

    render() {
        if (this.state.allPatientsReady) {
            return (
                <ModalProvider>
                    <Container>
                    <div>
                          <Navbar
                            over12={!this.state.under12}
                            setUnder12={check => {
                              check
                                ? this.serverConnect.setUnderTwelve()
                                : this.serverConnect.setOverTwelve();
                              this.setState({ under12: !check });
                              this.refresh();
                            }}
                            page="Patients"
                            onHomeClick={this.onHomeClick}
                            onSignoutClick={this.logout}
                            refresh={this.refresh}
                            openAddModal={this.openAddModal}
                          />
                          </div>
                        <TableContainer>
                            <PatientsTable
                                shownPatients={this.state.shownPatients}
                                openEditModal = {this.openEditModal}
                                filterNumber = {this.number_filter}
                                filterName = {this.name_filter}
                                filterSurname = {this.surname_filter}
                                filterEmail = {this.email_filter}
                                filterPhone = {this.phone_filter}
                            />
                        </TableContainer>
                        <Modal
                            open={this.state.openEditModal}
                            onClose={this.onCloseEditModal}
                            showCloseIcon={false}
                            style={modalStyles}
                            center
                            >
                            <PatientProfile
                                patientId={this.state.selectedId}
                                closeModal={this.onCloseEditModal}
                                editToken={this.state.editToken}
                                purpose={"Edit patient"}
                                handleError={this.handleError}
                            />
                        </Modal>

                        <Modal
                            open={this.state.openAddModal}
                            onClose={this.onCloseAddModal}
                            showCloseIcon={false}
                            style={modalStyles}
                            center
                        >
                            <NewPatient
                                closeModal={this.onCloseAddModal}
                                purpose={"Add patient"}
                                handleError={this.handleError}
                                allPatientsId={this.state.allPatients.map(patient => patient.patient_no)}
                            />
                        </Modal>

                    </Container>
                </ModalProvider>
            );
        } else {
            return (
                <div style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                }}>
                    <LoadingAnimation/>
                </div>
            );
        }
    }
}

export default Patients;
