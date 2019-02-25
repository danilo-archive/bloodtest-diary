import React from "react";
import styled from "styled-components";
import TitleTab from "./TitleTab";
import CalendarTable from "../../../calendarComponents/Calendar";

const Container = styled.div`
  position: relative;
  width: 49.8%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SecondHalfDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 70%;
  top: 30%;
  left: 0;
  background: red;
  z-index: 0;
`;
const TextArea = styled.textarea`
  width: 98%;
  height: 86%;
  resize: none;
  outline: none;
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
          <SecondHalfDiv>
            <TitleTab color="#0b999d">Observations</TitleTab>
            <TextArea
              onChange={event =>
                this.props.onObservationsChange(event.target.value)
              }
            />
          </SecondHalfDiv>
        </Container>
      </>
    );
  }
}
