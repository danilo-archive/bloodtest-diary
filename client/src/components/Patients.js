import React, { Component } from 'react';
import styled from 'styled-components'

import Navbar from "./homeComponents/navbar";
import PatientsTable from "./patientsComponents/PatientsTable";
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

class Patients extends Component {

    constructor(props){
        super(props);
        this.onHomeClick = this.onHomeClick.bind(this);
        this.serverConnect = getServerConnect();

        this.state = {
            allPatientsReady: false,
            allPatients: {}
        };
        this.initAllPatients();
    }

    initAllPatients() {
        this.serverConnect.getAllPatients(res => {
            this.setState({
                allPatients: res,
                allPatientsReady: true
            });
        });
    };


        onHomeClick(event) {
        this.props.history.push("home")
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
                    {/*<PatientProfile/>*/}
                    <TableContainer>
                        <PatientsTable
                            allPatients={this.state.allPatients}
                        />
                    </TableContainer>
                </Container>
            );
        } else {
            return ("");
        }
    }
}

export default Patients;
