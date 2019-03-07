import React from 'react';
import './DayCell.css';
//import {render} from 'react-dom'

function isSelected(isFromThisMonth, selectedDay, date, day){
  let selectedDate = new Date(selectedDay);
  return selectedDate.getDate() === day &&
          //current month
          ((isFromThisMonth 
          && date.getMonth() === selectedDate.getMonth()
          && date.getFullYear() === selectedDate.getFullYear())
          ||
          //previous month
          (!isFromThisMonth
          && date.getMonth()-1 === (selectedDate.getMonth()))
          ||
          //next month
          (!isFromThisMonth
          && date.getMonth()+1 === (selectedDate.getMonth())));
}

const DayCell = props => {
      let day = props.dayOfMonth;
      let date = props.date;
      let isFromThisMonth = props.isFromThisMonth;
      let selectedDay = props.selectedDay;
      let selected = isSelected(isFromThisMonth, selectedDay, date, day);
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
