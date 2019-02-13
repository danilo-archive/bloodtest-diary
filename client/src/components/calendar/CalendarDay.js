import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";
import MonthDaySection from "./MonthDaySection";
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
            backgroundColor: "white",
            padding: "0"
          }}
        >
          <WeekDaySection
            notificationNumber={
              this.props.dayNumber ? this.props.dayNumber : "1"
            }
            dayName={this.props.dayName || "Monday"}
          />
          <MonthDaySection
            dayNumber={this.props.dayNumber ? this.props.dayNumber : "01"}
            monthName={this.props.monthName || "June"}
          />
        </div>
      </>
    );
  }
}

export default CalendarDay;
