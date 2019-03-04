import React from 'react';
import './DayCell.css';
import {isSelected} from './CalendarFunctions.js';

const DayCell = props => {
      let day = props.dayOfMonth;
      let currentDate = props.date;
      let isFromThisMonth = props.isFromThisMonth;
      let selectedDay = props.selectedDay;
      let selected = isSelected(isFromThisMonth, selectedDay, currentDate, day);
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
