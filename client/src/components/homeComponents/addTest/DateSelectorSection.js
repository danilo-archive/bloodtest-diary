import React from "react";
import styled from "styled-components";
import TitleTab from "./TitleTab";
import CalendarTable from "../../calendarComponents/Calendar";
import FrequencySetter from "./FrequencySetter";

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
  height: 90%;
  top: 45%;
  left: 0;
  background: none;
  z-index: 0;
`;
const TextArea = styled.textarea`
  width: 98%;
  height: 47%;
  resize: none;
  outline: none;
`;

export default class DateSelectorSection extends React.Component {
  state = {
    selectedDate: this.props.selectedDate,
    showCalendar: false,
    frequency: {
      timeAmount: this.props.timeAmount,
      timmeUnit: this.props.timeUnit
    }
  };
  onInputClick = () => {
    this.setState({ showCalendar: true }); // [A] + [B] = [A,B]// [...arrayA,...arrayB] = [A,B]
  };

  onSliderChange = timeAmount => {
    this.setState({ timeAmount });
    this.props.onTimeAmountChange(timeAmount);
  };
  onUnitChange = timeUnit => {
    this.setState({ timeUnit });
    this.props.onUnitChange(timeUnit);
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
          <FrequencySetter
            unitOptions={this.props.unitOptions}
            timeAmount={this.state.frequency.timeAmount}
            timeUnit={this.state.frequency.timeUnit}
            onSliderChange={value => this.onSliderChange(value)}
            onSelectChange={value => this.onUnitChange(value)}
            onOccurrenceChange={value => this.props.onOccurrenceChange(value)}
          />

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
