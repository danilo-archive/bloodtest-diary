import React, { Component } from 'react';
import './Calendar.css';
import './CalendarFunctions.js';
import DayCell from './DayCell.js';
import CalendarHeader from './CalendarHeader.js';

const WEEK_DAYS = 7;
const CALENDAR_SIZE = 35;

function getDaysInMonth(year, month){
  return new Date(year, month, 0).getDate();
}

function getYearOf(date){
  return date.getFullYear(date);
}

function getMonthOf(date){
  return date.getMonth() + 1;
}

function getFirstDayOf(year, month){
  return new Date(year, month, 1).getDay();
}



let days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

var date;

function getCalendar(){
  date = new Date();
  let currentYear = getYearOf(date);
  let currentMonth = getMonthOf(date);
  let firstDay = getFirstDayOf(currentYear, currentMonth); //first week day of the month
  let lastDay = getDaysInMonth(currentYear, currentMonth); //days in the month
  let prevMonthLastDay = getDaysInMonth(currentYear, currentMonth-1);
  let arrCalendar = [];
  let calendar = [];

  for (let i = 0; i < firstDay; ++i) {
    arrCalendar.unshift(prevMonthLastDay-i);
  }

  for (let i = 0; i < lastDay;) {
    arrCalendar.push(++i);
  }

  for (let i = lastDay; i < CALENDAR_SIZE; ++i) {
    arrCalendar.push(i - lastDay + 1);
  }

  let rows = arrCalendar.length%WEEK_DAYS;
  for(let i = 0; i < rows; ++i){
    calendar[i] = new Array(WEEK_DAYS);
    for(let j = 0; j < WEEK_DAYS; j++){
      calendar[i].push(arrCalendar[WEEK_DAYS*i + j]);
    }
  }
  return calendar;
}

function prevMonth(){
  date.setMonth(date.getMonth() - 1);
  console.log(date);
}

function nextMonth(){
  date.setMonth(date.getMonth() + 1);
  console.log(date);
}

var dayBelongsToCurrentMonth = false;

class CalendarTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      calendar: getCalendar(),
      date: date,
      selected: null,
    }
  }
  
  render() {
    return (
      <table id={'daysTable'} cellPadding={0} cellSpacing={0}>
        <thead>
          <CalendarHeader currentDate={this.state.date} 
                          prevMonth={() => this.setState({date: prevMonth(),
                                                          /*calendar: getCalendar()*/})}
                          nextMonth={() => this.setState({date: nextMonth(),
                                                          /*calendar: getCalendar()*/})}/>
          <tr>  
            {days.map((day) => {
              return (
                <th key={day}>
                  {day}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {this.state.calendar.map((row, trIndex) => {
            return(
              <tr key={trIndex}>
                {row.map((day, tdIndex) => {
                    if(day === 1) {
                      dayBelongsToCurrentMonth = !dayBelongsToCurrentMonth;
                    }
                    return(
                      <td key={tdIndex} className={`${(dayBelongsToCurrentMonth) ? "in" : "out"} day`}>
                        {<DayCell onClick={() => (console.log("click"))}
                                  dayOfMonth={day} 
                                  isFromThisMonth={dayBelongsToCurrentMonth}/>}
                      </td>
                    );
                  }
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default CalendarTable;
