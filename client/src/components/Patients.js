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
    height: calc(100vh - 65px);
    width: auto;
    position: relative;
    top: 30px;
    margin: 1% 1% 1% 1%;

  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  background: rgb(244,249,253);
`;

const NavbarContainer = styled.div`
    border: #839595 0 solid;

    background-color: white;

    margin-bottom: 1%;

    padding: 10px 1%;

    min-height: 150px;
    max-height: 150px;

    flex-grow: 1;
    flex-shrink: 2;

    overflow: hidden;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

const TableContainer = styled.div`
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch ;

    flex-grow: 1;
    flex-shrink: 1;
`;

const Button = styled.button`
  border: none;
  margin-bottom: 1%;
  color: white;
  padding: 7px 12px;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: 200;
  background-color: #0b989d;
  word-break: break-word;
  font-family: "Rajdhani",sans-serif;
  outline: none;
  :hover {
    background: #018589;
  }
`;

const modalStyles = {
    border: `solid 0 black`
};

class Patients extends React.Component {

    constructor(props){
        super(props);
        this.onHomeClick = this.onHomeClick.bind(this);
        this.serverConnect = getServerConnect();
        this.serverConnect.joinPatientsPage();

        this.state = {
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
            openAlert("Authentication error", "confirmationAlert", "Go back to login", () => {this.logout()});
        }else{
            openAlert(`${error ? error : "Unknown error occurred"}`, "confirmationAlert", "Ok", () => {return});
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
                patient => patient.patient_no.includes(value)
              )
            });
        }
    };

    name_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_name ? patient.patient_name.includes(value) : false
              )
            });
        }
    };

    surname_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_surname ? patient.patient_surname.includes(value) : false
              )
            });
        }
    };

    email_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_email ? patient.patient_email.includes(value) : false
              )
            });
        }
    };

    phone_filter = value => {
        if (value === "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_phone ? patient.patient_phone.includes(value) : false
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
    }


    openEditModal = id => {
        this.serverConnect.requestPatientEditing(id, res => {
            console.log(`id in openEditModal: ${id}`);
            if (res.token){
                this.setState({selectedId: id, openEditModal: true, editToken: res.token});
            }else{
                this.handleError(res, "Somebody is already editing this patient");
            }
        });
    };


    onCloseEditModal = () => {
        console.log("closing modal");
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

    //TODO : rename all components to capital case
    render() {
        if (this.state.allPatientsReady) {
            return (
                <ModalProvider>
                    <Container>
                        <NavbarContainer>
                            <Navbar
                                onHomeClick={this.onHomeClick}
                                onSignoutClick={this.logout}
                                refresh={this.refresh}

                            />
                        </NavbarContainer>
                        <Button onClick={this.openAddModal}>Add patient</Button>
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
