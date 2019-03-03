import React, { Component } from 'react';
import './Calendar.css';
import './CalendarFunctions.js';
import DayCell from './DayCell.js';
import CalendarHeader from './CalendarHeader.js';

const DAYS_IN_A_WEEK = 7;
const HALF_MONTH = 15;
const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getYearOf(date) {
  return date.getFullYear(date);
}

function getMonthOf(date) {
  return date.getMonth();
}

function getFirstDayOf(year, month) {
  return new Date(year, month-1, 1).getDay();
}



var dayBelongsToCurrentMonth = false;

function getCalendar(date) {
  let currentYear = getYearOf(date);
  let currentMonth = getMonthOf(date) + 1;
  let firstDay = getFirstDayOf(currentYear, currentMonth); //first week day of the month
  let lastDay = getDaysInMonth(currentYear, currentMonth); //days in the month
  let prevMonthLastDay = getDaysInMonth(currentYear, currentMonth - 1);
  let arrCalendar = [];
  let calendar = [];
  let whiteCells = 0;

  for (let i = 0; i < firstDay; ++i) {
    arrCalendar.unshift(prevMonthLastDay - i);
  }

  for (let i = 0; i < lastDay;) {
    arrCalendar.push(++i);
  }

  whiteCells = DAYS_IN_A_WEEK - (arrCalendar.length % DAYS_IN_A_WEEK);

  for (let i = lastDay; whiteCells > 0; ++i) {
    arrCalendar.push(i - lastDay + 1);
    whiteCells--;
  }

  let rows = arrCalendar.length / DAYS_IN_A_WEEK;

  for (let i = 0; i < rows; ++i) {
    calendar[i] = new Array(DAYS_IN_A_WEEK);
    for (let j = 0; j < DAYS_IN_A_WEEK; j++) {
      calendar[i].push(arrCalendar[DAYS_IN_A_WEEK * i + j]);
    }
  }
  return calendar;
}

class CalendarTable extends Component {
  constructor(props) {
    super(props);
    let currentDate = new Date();
    this.state = {
      date: currentDate,
      calendar: getCalendar(currentDate),
      selected: null
    };

    this.select = this.select;
    this.nextMonth = this.nextMonth;
    this.prevMonth = this.prevMonth;
    this.getDaysInMonth = getDaysInMonth;
    this.returnDate = this.returnDate;

    this.prevMonth = () => {
      let date = this.state.date;
      let newDate = new Date(date.setMonth(date.getMonth() - 1));
      this.setState({
        date: newDate,
        calendar: getCalendar(newDate)
      });
    };
    this.nextMonth = () => {
      let date = this.state.date;
      let newDate = new Date(date.setMonth(date.getMonth() + 1));
      this.setState({
        date: newDate,
        calendar: getCalendar(newDate)
      })
    };
    this.selectDay = (day, isFromThisMonth) => {
      let date = this.state.date;
      //  the month returned by Date class is always smaller by 1
      //  then it should be, for the date to be useable by the database
      //  the monthCorrector starts from 1 to add it back.
      let monthCorrector = 1;
      if (!isFromThisMonth) {
        //the day is from the next month
        if (day < HALF_MONTH) {
          monthCorrector++;
        } else {
          monthCorrector--;
        }
      }
      let month = date.getMonth() + monthCorrector;
      let year = date.getFullYear();
      if (month === 13) {
        year++;
        month = 1;
      }else if(month === 0){
        year--;
        month = 12;        
      }
      this.setState({ selected: `${year}-${month}-${day}` });
    };
    this.returnDate = () => {
      return this.state.selected;
    }
  }

  render() {
    return (
      <table id={'daysTable'} cellPadding={0} cellSpacing={0}>
        <thead>
          <CalendarHeader currentDate={this.state.date}
            prevMonth={this.prevMonth}
            nextMonth={this.nextMonth} />
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
            return (
              <tr key={trIndex}>
                {row.map((day, tdIndex) => {
                  if (day === 1) {
                    dayBelongsToCurrentMonth = !dayBelongsToCurrentMonth;
                  }
                  return (
                    <td key={tdIndex} className={`${(dayBelongsToCurrentMonth) ? "in" : "out"} day`}>
                      {<DayCell selectDay={this.selectDay}
                        selectedDay={this.state.selected}
                        date={this.state.date}
                        dayOfMonth={day}
                        isFromThisMonth={dayBelongsToCurrentMonth} />}
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
