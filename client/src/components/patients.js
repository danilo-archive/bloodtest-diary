import React, { Component } from 'react';

import Navbar from "./homeComponents/navbar";
import './patients.css';

class Patients extends Component {

    constructor(props){
        super(props);
        this.onHomeClick = this.onHomeClick.bind(this);
    }

    onHomeClick(event) {
        this.props.history.push("home")
    }

    render() {
        return (

            <div className={"patients"}>
                <div className={"navbar"}>
                    <Navbar
                        onHomeClick={this.onHomeClick}
                    />
            </div>
            </div>
        );
    }
}

export default Patients;
