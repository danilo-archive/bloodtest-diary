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
  state = { selectedDate: this.props.selectedDate, showCalendar: false };
  onInputClick = () => {
    this.setState({ showCalendar: true }); // [A] + [B] = [A,B]// [...arrayA,...arrayB] = [A,B]
  };

  onDayClicked = day => {
    this.setState({ showCalendar: false });
  };

  onDateSelect = selectedDate => {
    this.setState({ showCalendar: false, selectedDate });
    this.props.onDateSelect(selectedDate);
  };
  render() {
    return (
      <>
        <Container>
          <TitleTab color="#0b999d">Date</TitleTab>
          <br />
          <input
            type="text"
            onClick={this.onInputClick}
            value={this.state.selectedDate}
            readOnly
          />
          {this.state.showCalendar ? (
            <CalendarTable onDateSelect={day => this.onDateSelect(day)} />
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
