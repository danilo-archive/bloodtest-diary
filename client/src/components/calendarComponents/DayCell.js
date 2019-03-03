import React from 'react';
import './DayCell.css';

/**
 * Return True if the selected date is in the days of the
 *  calendar belonging to the current month
 * @param {string} selectedDay: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @return {boolean} True iff the day appears in the calendar table
 *  and belongs to the current month, otherwise False
 */
function selectedDayIsFromCurrentMonth(selectedDate, currentDate){
  return currentDate.getMonth() === selectedDate.getMonth() &&
         currentDate.getFullYear() === selectedDate.getFullYear();
}

/**
 * Return True if the selected date is in the days of the
 *  calendar belonging to the previous month
 * @param {string} selectedDay: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @param {integer} day: the number of the day contained in this DayCell
 * @return {boolean} True iff the day appears in the calendar table
 *  and belongs to the previous month, otherwise False
 */
function selectedDayIsFromPreviousMonth(selectedDate, currentDate, day){
  return currentDate.getMonth() === (selectedDate.getMonth()+1)%12 &&      //
         day > 15 && 
         (currentDate.getFullYear() === selectedDate.getFullYear() ||
          (currentDate.getFullYear()-1 === selectedDate.getFullYear() &&
           selectedDate.getMonth() === 11));
}

/**
 * Return True if the selected date is in the days of the
 *  calendar belonging to the next month
 * @param {string} selectedDay: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @param {integer} day: the number of the day contained in this DayCell
 * @return {boolean} True iff the day appears in the calendar table
 *  and belongs to the next month, otherwise False
 */
function selectedDayIsFromNextMonth(selectedDate, currentDate, day){
  // new Date(date.setMonth(date.getMonth() + 1)).getMonth()
  return (currentDate.getMonth()+1)%12 === selectedDate.getMonth() && 
          day < 15 &&
          (currentDate.getFullYear() === selectedDate.getFullYear() ||
          (currentDate.getFullYear()+1 === selectedDate.getFullYear() &&
           selectedDate.getMonth() === 0));
}

/**
 * Return True if the day is selected
 * @param {boolean} isFromThisMonth: the day belongs to
 *  the current month.
 * @param {string} selectedDay: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @param {integer} day: the number of the day contained in this DayCell
 * @return {boolean} True if the day is selected, False otherwise
 */
function isSelected(isFromThisMonth, selectedDay, currentDate, day){
  let selectedDate = new Date(selectedDay);
  return selectedDate.getDate() === day &&
          //current month
          ((isFromThisMonth && selectedDayIsFromCurrentMonth(selectedDate, currentDate)) || 
          //adjacent months
          (!isFromThisMonth &&
            (selectedDayIsFromPreviousMonth(selectedDate, currentDate, day) ||
            (selectedDayIsFromNextMonth(selectedDate, currentDate, day)))));
}

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
