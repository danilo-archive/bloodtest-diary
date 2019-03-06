import React from 'react';
import './DayCell.css';
import {isSelected} from '../../lib/calendar-functions.js';

const DayCell = props => {
      const day = props.dayOfMonth;
      const currentDate = props.date;
      const isFromThisMonth = props.isFromThisMonth;
      const selectedDay = props.selectedDay;
      const selected = isSelected(isFromThisMonth, selectedDay, currentDate, day);
      return(
        <button id={`${day}${isFromThisMonth}`}
                className={`${(isFromThisMonth) ? 'current' : 'not-current'}
                            ${(selected) ? 'selected' : 'not-selected'} 
                            day-number`}
                onClick={() => props.selectDay(day, isFromThisMonth)} >
          {day}
        </button>
      );
  }

export default DayCell;

