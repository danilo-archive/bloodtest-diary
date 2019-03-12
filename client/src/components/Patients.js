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

  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;

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
    height: 80%;
    width: 100%;

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
            openModal: false,
            selectedId: undefined
        };
        this.initOnPatientEditedCallback();
        this.initAllPatients();

        this.refresh = this.refresh.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    refresh(event){
        this.initAllPatients();
    }

    initOnPatientEditedCallback(){
        this.serverConnect.setOnPatientEdited((patientId, newInfo) => {
            this.initAllPatients();
        });
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
        this.serverConnect.discardPatientEditing(this.state.selectedId, this.state.editToken, res => {
            this.setState({selectedId: undefined, openModal: false, editToken: undefined});
        });

    }

    //TODO : rename all components to capital case
    render() {
        if (this.state.allPatientsReady) {
            return (
                <Container>
                    <NavbarContainer>
                        <Navbar
                            onHomeClick={this.onHomeClick}
                            refresh={this.refresh}
                        />
                    </NavbarContainer>
                    {<TableContainer>
                        <PatientsTable
                            allPatients={this.state.shownPatients}
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
