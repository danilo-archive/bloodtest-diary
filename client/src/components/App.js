import React, { Component } from "react";
import Header from "./header.js";
import "./App.css";

import Login from "./login";
import CalendarDay from "./calendar/CalendarDay";
import WeekView from "./calendar/WeekView.js";
class App extends Component {
  render() {
    return (
      <div>
        <WeekView />
      </div>
    );
  }
}

export default App;
