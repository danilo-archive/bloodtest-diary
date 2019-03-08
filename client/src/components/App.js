import React, { Component } from "react";
import Header from "./header.js";

import Login from "./login";
import PatientProfile from "./patientsComponents/PatientProfile.js";
import AttributeSelector from "./patientsComponents/AttributeSelector";
import patients from "./Patients";


class App extends Component {
  render() {
    return (
      <div>
        <PatientProfile/>
      </div>
    );
  }
}

export default App;
