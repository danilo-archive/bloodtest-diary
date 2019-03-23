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
  height: 74%;
  top: 55%;
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

export default props => {
  return (
    <>
      <Container>
        <TitleTab color="#0b999d">Date</TitleTab>
        <br />
        <input
          type="text"
          onClick={props.onInputClick}
          value={props.selectedDate}
          readOnly
        />
        {props.showCalendar ? (
          <CalendarTable onDayPick={props.onDayPick} onDaySelected={day => props.onDateSelect(day)} />
        ) : (
          <></>
        )}
        <FrequencySetter
          noRepeat={props.noRepeat}
          onNoRepeatChange={props.onNoRepeatChange}
          unitOptions={props.unitOptions}
          timeAmount={props.timeAmount}
          timeUnit={props.timeUnit}
          onSliderChange={value => props.onTimeAmountChange(value)}
          onSelectChange={value => props.onUnitChange(value)}
          onOccurrenceChange={value => props.onOccurrenceChange(value)}
        />

        <SecondHalfDiv>
          <TitleTab color="#0b999d">Observations</TitleTab>
          <TextArea
            onChange={event => props.onObservationsChange(event.target.value)}
          />
        </SecondHalfDiv>
      </Container>
    </>
  );
};
