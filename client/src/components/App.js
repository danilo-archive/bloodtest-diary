import React, { Component } from "react";
import Header from "./header.js";

import Login from "./login";
import AddTestView from "./homeComponents/addTest/AddTestView.js";
import EditTestView from "./homeComponents/editTest/EditTestView.js";
class App extends Component {
  render() {
    return (
      <div>
        <EditTestView/>
      </div>
    );
  }
}

export default App;
