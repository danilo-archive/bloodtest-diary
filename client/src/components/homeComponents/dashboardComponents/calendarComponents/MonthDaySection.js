import React from "react";
import styled from "styled-components";

import DateText from "./DateText";
import NotificationIcon from "./NotificationIcon";

const MonthDayDiv = styled.div`
  padding-left: 35%;
  width: auto;
  height: 80px;
  background-color: #0b999d;
  display: flex;
  flex-direction: row;
  text-align: center;
  position: relative;
`;

const MonthDaySection = props => {
  return (
    <>
      <MonthDayDiv>
        <DateText month={props.monthName} day={props.dayNumber} />
        <NotificationIcon
          fontSize="500%"
          text="+"
          top="97%"
          size="40px"
          left="90%"
          onClick={() => prompt("Add Appointment")}
        />
      </MonthDayDiv>
    </>
  );
};

export default MonthDaySection;
