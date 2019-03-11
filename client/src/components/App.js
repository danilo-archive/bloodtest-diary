import React, { Component } from "react";
import Header from "./header.js";

import EditTestView from "./homeComponents/editTest/EditTestView.js";

class App extends Component {
  render() {
    return (
      <div>
        <EditTestView
          patient={{ name: "Alvaro Rausell", id: "12345689" }}
          test={{
            id: "987654321",
            date: {
              dueDate: "24-08-1929",
              frequency: "33-Y",
              occurrences: 5
            },
            status: "completed"
          }}
        />
      </div>
    );
  }
}

export default App;
