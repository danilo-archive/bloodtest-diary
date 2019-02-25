import React from "react";
import styled from "styled-components";
import TitleTab from "./TitleTab";
import CalendarTable from "../../../calendarComponents/Calendar";

const Container = styled.div`
  width: 49.8%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default class DateSelectorSection extends React.Component {
  state = { selectedDate: "", showCalendar: false };
  onInputClick = () => {
    this.setState({ showCalendar: true });
  };

  onDayClicked = day => {
    this.setState({ showCalendar: false });
  };
  render() {
    return (
      <>
        <Container>
          <TitleTab color="#0b999d">Date</TitleTab>
          <br />
          <input
            type="text"
            placeholder="Select Date..."
            onClick={this.onInputClick}
            text={this.state.selectedDate}
          />
          {this.state.showCalendar ? (
            <CalendarTable onDayClicked={day => this.onDayClicked(day)} />
          ) : (
            <></>
          )}
        </Container>
      </>
    );
  }
}
