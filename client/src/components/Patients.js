import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-responsive-modal';
import ModalStyle from "./Modal";
import { ModalProvider } from "styled-react-modal";
import "./Modal.css";

import Navbar from "./homeComponents/navbar";
import PatientsTable from "./patientsComponents/tableComponents/PatientsTable";

import {getServerConnect} from "../serverConnection.js";
import PatientProfile from "./patientsComponents/PatientProfile";
import NewPatient from "./patientsComponents/NewPatient";


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

`;

const NavbarContainer = styled.div`
    border: #839595 0px solid;

    background-color: white;

    margin-bottom: 1%;

    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 1%;
    padding-right: 1%;

    min-height: 150px;
    max-height: 150px;

    flex-grow: 1;
    flex-shrink: 2;

    overflow: hidden;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

const TableContainer = styled.div`
    color: #ffffff;
    border: green 0 solid;
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
    padding: `0`
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

        this.updateRecords = this.updateRecords.bind(this);
        this.refresh = this.refresh.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.onCloseEditModal = this.onCloseEditModal.bind(this);
        this.logout = this.logout.bind(this);
        this.openAddModal = this.openAddModal.bind(this);
        this.onCloseAddModal = this.onCloseAddModal.bind(this);
    }

    refresh(event){
        this.initAllPatients();
    }

    initAllPatients() {
        console.log("fire");
        this.serverConnect.getAllPatients(res => {
            this.setState({
                allPatients: res,
                shownPatients: res,
                allPatientsReady: true
            });
        });
    };

    initOnPatientEditedCallback(){
        this.serverConnect.setOnPatientEdited((patientId, newInfo) => {
            this.updateRecords(patientId, newInfo);
        });
    }
    updateRecords(id, newInfo){
        for (var i = 0; i < this.state.allPatients.length ; ++i){
            let patient = this.state.allPatients[i];
            if (patient.patient_no === id){
                let newPatients = [...this.state.allPatients];
                newPatients[i] = newInfo
                this.setState({allPatients: newPatients});
                break;
            }
        }
        for (var i = 0; i < this.state.shownPatients.length ; ++i){
            let patient = this.state.shownPatients[i];
            if (patient.patient_no === id){
                let newPatients = [...this.state.shownPatients];
                newPatients[i] = newInfo
                this.setState({shownPatients: newPatients});
                return;
            }
        }
    }

    number_filter = value => {
        if (value == "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_no.includes(value)
              )
            });
        }
    };

    name_filter = value => {
        if (value == "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_name ? patient.patient_name.includes(value) : false
              )
            });
        }
    };

    surname_filter = value => {
        if (value == "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_surname ? patient.patient_surname.includes(value) : false
              )
            });
        }
    };

    email_filter = value => {
        if (value == "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_email ? patient.patient_email.includes(value) : false
              )
            });
        }
    };

    phone_filter = value => {
        if (value == "") { this.setState({shownPatients: this.state.allPatients})}
        else{
            this.setState({
              shownPatients: this.state.allPatients.filter(
                patient => patient.patient_phone ? patient.patient_phone.includes(value) : false
              )
            });
        }
    };

    onHomeClick(event) {
        this.props.history.push("home")
    }

    logout(event){
        this.serverConnect.deleteLoginToken();
        this.props.history.replace("");
    }

    openEditModal(id){
        this.serverConnect.requestPatientEditing(id, token => {
            console.log(`id in openEditModal: ${id}`);
            if (token){
                this.setState({selectedId: id, openEditModal: true, editToken: token});
            }else{
                // TODO open error dialoge "someone is editing this patient"
            }
        });
    }


    onCloseEditModal(){
        // TODO get rid of the torken
        console.log("closing modal");
        this.serverConnect.discardPatientEditing(this.state.selectedId, this.state.editToken, res => {
            this.setState({selectedId: undefined, openEditModal: false, editToken: undefined});
        });

    }

    openAddModal() {
        this.setState({openAddModal: true});
    }

    onCloseAddModal() {
        this.setState({openAddModal: false})
    }

    //TODO : rename all components to capital case
    render() {
        if (this.state.allPatientsReady) {
            return (
                <Container>
                    <NavbarContainer>
                        <Navbar
                            onHomeClick={this.onHomeClick}
                            onSignoutClick={this.logout}
                            refresh={this.refresh}

                        />
                    </NavbarContainer>
                    <Button onClick={this.openAddModal}>Add patient</Button>
                    {<TableContainer>
                        <PatientsTable
                            shownPatients={this.state.shownPatients}
                            openEditModal = {this.openEditModal}
                            filterNumber = {this.number_filter}
                            filterName = {this.name_filter}
                            filterSurname = {this.surname_filter}
                            filterEmail = {this.email_filter}
                            filterPhone = {this.phone_filter}
                        />
                    </TableContainer>}
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
                        />
                    </Modal>

                </Container>
            );
        } else {
            return ("");
        }
    }
}

export default Patients;
