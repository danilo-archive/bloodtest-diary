import React, { Component } from "react";
import Header from "./header.js";

import Login from "./login";
import AddTestView from "./homeComponents/dashboardComponents/addTest/AddTestView.js";
class App extends Component {
  render() {
    return (
      <div>
        <AddTestView selectedDate="2-3-2015" />
      </div>
    );
  }
}

export default App;
