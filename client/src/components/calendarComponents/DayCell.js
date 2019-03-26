import React from 'react';
import {isSelected} from '../../lib/calendar-functions.js';
import styled from "styled-components";

const Day = styled.button`

  width: 100%;
  height: 100%;
  background-color: #0b989d;
  font-size: 100%;
  color: white;
  text-align: center;
  border: none;
  padding: 0;

  &:hover {
      color: #0b989d;
  }

  & .current{
      font-size: 100%;
      font-weight: bold;
  }

  & .not-current {
      font-size: 75%;
  }

  & .selected {
      background-color: #133952;
  }

  & .selected:hover {
      background-color: aqua;
  }

  & .not-selected {
      background-color: inherit;
  }

  & .not-selected:hover {
      background-color: #133952;
  }
`;

const DayCell = props => {
      const day = props.dayOfMonth;
      const currentDate = props.date;
      const isFromThisMonth = props.isFromThisMonth;
      const selectedDay = props.selectedDay;
      const selected = isSelected(isFromThisMonth, selectedDay, currentDate, day);
      return(
        <Day id={`${day}${isFromThisMonth}`}
                className={`${(isFromThisMonth) ? 'current' : 'not-current'}
                            ${(selected) ? 'selected' : 'not-selected'} 
                            day-number`}
                onClick={() => props.selectDay(day, isFromThisMonth)} >
          {day}
        </Day>
      );
  }

export default DayCell;
