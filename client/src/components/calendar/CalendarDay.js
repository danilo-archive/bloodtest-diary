import React from "react";
import styled from "styled-components";

import WeekDaySection from "./WeekDaySection";
import MonthDaySection from "./MonthDaySection";
import ScrollBox from "./ScrollBox";
import { relative } from "path";
import Icon from "./Icon";

const CalendarContainer = styled.div`
  margin: 5%;
  padding: 10%;
  width: 300px;
  height: 495px;
  background-color: white;
  padding: 0;
`;

class CalendarDay extends React.Component {
  render() {
    return (
      <>
        <CalendarContainer>
          <WeekDaySection
            notificationNumber={
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "1"
            }
            dayName={this.props.dayName || "Monday"}
          />
          <MonthDaySection
            dayNumber={this.props.dayNumber ? this.props.dayNumber : "01"}
            monthName={this.props.monthName || "June"}
          />
          <ScrollBox>
            <Icon icon="edit" />
          </ScrollBox>
        </CalendarContainer>
      </>
    );
  }
}

export default CalendarDay;
