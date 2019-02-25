import React, { Component } from "react";
import Header from "./header.js";

import Login from "./login";
import AddTestView from "./homeComponents/dashboardComponents/addTest/AddTestView.js";
class App extends Component {
  render() {
    return (
      <div>
        <AddTestView />
      </div>
    );
  }
}

export default App;
