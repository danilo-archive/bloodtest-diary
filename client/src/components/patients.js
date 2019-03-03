import React, { Component } from 'react';

import Navbar from "./homeComponents/navbar";
import './patients.css';
import PatientsTable from "./patientsComponents/patientsTable";
import {getServerConnect} from "../serverConnection.js";


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

    render() {
        if (this.state.allPatientsReady) {
            return (
                <div className={"patients"}>
                    <div className={"navbar"}>
                        <Navbar
                            onHomeClick={this.onHomeClick}
                        />
                    </div>
                    <div className={"patientsTable"}>
                        <PatientsTable
                            allPatients={this.state.allPatients}
                        />
                    </div>
                </div>
            );
        } else {
            return ("");
        }
    }
}

export default Patients;
