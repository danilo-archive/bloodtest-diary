import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";

class CalendarDay extends React.Component {
  render() {
    return (
      <>
        <div
          style={{
            margin: "30px",
            padding: "30px",
            width: "300px",
            height: "495px",
            backgroundColor: "black",
            padding: "0"
          }}
        >
          <WeekDaySection
            dayNumber={this.props.dayNumber ? this.props.dayNumber : "1"}
          />
        </div>
      </>
    );
  }
}

export default CalendarDay;
