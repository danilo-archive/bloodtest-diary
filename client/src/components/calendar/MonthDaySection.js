import React from "react";
import styled from "styled-components";

import Label from "../Label";
import DateText from "./DateText";

const MonthDayDiv = styled.div`
  padding-left: 35%;
  width: 100%;
  height: 22%;
  background-color: #0b999d;
  display: flex;
  flex-direction: row;
  text-align: center;
`;

const MonthDaySection = props => {
  return (
    <>
      <MonthDayDiv>
        <DateText month={props.monthName} day={props.dayNumber} />
      </MonthDayDiv>
    </>
  );
};

export default MonthDaySection;
