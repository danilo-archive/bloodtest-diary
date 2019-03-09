import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-responsive-modal';

import Navbar from "./homeComponents/navbar";
import PatientsTable from "./patientsComponents/tableComponents/PatientsTable";
//import AttributeSelector from "./patientsComponents/AttributeSelector";

import {getServerConnect} from "../serverConnection.js";
import PatientProfile from "./patientsComponents/PatientProfile";


const Container = styled.div`
  border: blue 0 solid;
    height: calc(100vh - 65px);
    width: auto;
    position: relative;
    top: 30px;
    margin: 1% 1% 1% 1%;

    display: flex;
    flex-direction: row;
    align-items: flex-start;

`;

const NavbarContainer = styled.div`
    border: #839595 3px solid;
    border-radius: 10px;
    margin-left: 0.5%;
    margin-bottom: 9px;

    max-height: 225px;
    min-height: 200px;
    width: auto;

    flex-grow: 1;
    flex-shrink: 1;

    overflow: scroll;
`;

const TableContainer = styled.div`
    color: #ffffff;
    border: green 0 solid;
    height: auto;
    width: auto;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch ;

    flex-grow: 1;
    flex-shrink: 1;
`;
const modalStyles = {
    padding: 0
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
            openModal: false,
            selectedId: undefined
        };
        this.initAllPatients();

        this.openModal = this.openModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    initAllPatients() {
        this.serverConnect.getAllPatients(res => {
            this.setState({
                allPatients: res,
                shownPatients: res,
                allPatientsReady: true
            });
        });
    };

    number_filter = value => {
        let filteredPatients = this.state.allPatients.filter( patient => patient.patient_no.includes(value));
        this.setState({shownPatients: filteredPatients});
    };

    name_filter = value => {
        let filteredPatients = this.state.allPatients.filter( patient => patient.patient_name.includes(value));
        this.setState({shownPatients: filteredPatients});
    };

    surname_filter = value => {
        let filteredPatients = this.state.allPatients.filter( patient => patient.patient_surname.includes(value));
        this.setState({shownPatients: filteredPatients});
    };

    email_filter = value => {
        let filteredPatients = this.state.allPatients.filter( patient => patient.patient_email.includes(value));
        this.setState({shownPatients: filteredPatients});
    };

    phone_filter = value => {
        let filteredPatients = this.state.allPatients.filter( patient => patient.patient_phone.includes(value));
        this.setState({shownPatients: filteredPatients});
    };


    onHomeClick(event) {
        this.props.history.push("home")
    }

    openModal(id){
        this.serverConnect.requestPatientEditing(id, token => {
            console.log(`id in openModal: ${id}`);
            if (token){
                this.setState({selectedId: id, openModal: true, editToken: token});
            }else{
                // TODO open error dialoge "someone is editing this patient"
            }
        });

    }

    onCloseModal(){
        // TODO get rid of the torken
        console.log("closing modal");
        this.setState({selectedId: undefined, openModal: false, editToken: undefined});
    }

    //TODO : rename all components to capital case
    render() {
        if (this.state.allPatientsReady) {
            return (
                <Container>
                    <NavbarContainer>
                        <Navbar
                            onHomeClick={this.onHomeClick}
                        />
                    </NavbarContainer>
                    {<TableContainer>
                        <PatientsTable
                            shownPatients={this.state.shownPatients}
                            numberFilter={this.number_filter}
                            nameFilter = {this.name_filter}
                            surnameFilter = {this.surname_filter}
                            emailFilter = {this.email_filter}
                            phoneFilter = {this.phone_filter}
                            openModal = {this.openModal}
                        />
                    </TableContainer>}
                    <Modal
                        open={this.state.openModal}
                        onClose={this.onCloseModal}
                        showCloseIcon={false}
                        style={modalStyles}
                        center
                        >
                    <PatientProfile
                        patientId={this.state.selectedId}
                        closeModal={this.onCloseModal}
                        editToken={this.state.editToken}
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
