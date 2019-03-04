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
        <label style={{color: (!isFromThisMonth) ? '#0b989d' : 'white'}}>
          <button className={(selected) ? 'selected' : 'notSelected'}
                  id={`${day}${isFromThisMonth}`}
                  onClick={() => props.selectDay(day, isFromThisMonth)} >
            {day}
          </button>
        </label>
      );
  }

export default DayCell;
