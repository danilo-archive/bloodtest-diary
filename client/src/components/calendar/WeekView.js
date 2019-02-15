import React from "react";
import styled from "styled-components";
import CalendarDay from "./CalendarDay";

const WeekContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10%;
`;
export default class WeekView extends React.Component {
  render() {
    return (
      <WeekContainer>
        <CalendarDay />
        <CalendarDay />
        <CalendarDay />
        <CalendarDay />
        <CalendarDay />
      </WeekContainer>
    );
  }
}
