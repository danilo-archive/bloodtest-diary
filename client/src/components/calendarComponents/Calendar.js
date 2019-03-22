import React, { Component } from "react";
import "./Calendar.css";
import { getCalendar } from "../../lib/calendar-functions.js";
import DayCell from "./DayCell.js";
import CalendarHeader from "./CalendarHeader.js";
import dateformat from "dateformat";

const HALF_MONTH = 15;
const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

let dayBelongsToCurrentMonth = false;

class CalendarTable extends Component {
  constructor(props){
    super(props);
    const currentDate = new Date();
    this.state = {
      date: currentDate,
      calendar: getCalendar(currentDate),
      selected: null
    };
    this.select = this.select;
    this.nextMonth = this.nextMonth;
    this.prevMonth = this.prevMonth;
    this.returnDate = this.returnDate;
    this.onDayPick = this.props.onDayPick;

    this.prevMonth = () => {
      const date = this.state.date;
      const newDate = new Date(date.setMonth(date.getMonth() - 1));
      this.setState({
        date: newDate,
        calendar: getCalendar(newDate)
      });
    };
    this.nextMonth = () => {
      const date = this.state.date;
      const newDate = new Date(date.setMonth(date.getMonth() + 1));
      this.setState({
        date: newDate,
        calendar: getCalendar(newDate)
      });
    };
    this.selectDay = (day, isFromThisMonth) => {
      const date = this.state.date;
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
      } else if (month === 0) {
        year--;
        month = 12;
      }





      // ---------------- HERE THE DATE IS PRINTED CORRECTLY

      console.log(`${year}-${month}-${day}`)
      const dateFormatted = dateformat(new Date(`${year}-${month}-${day}`), "d mmm yyyy");

      this.setState({ selected: dateFormatted});
      if (this.props.onDaySelected) {
        this.props.onDaySelected(dateFormatted);
      }
      // ---------------- HERE IS NOT SINCE THE PARSING IS NOT WORKING CORRECTLY
      console.log(this.state.selected)
      this.onDayPick(dateFormatted);




      

      this.props.hideCalendar();
    };
    this.returnDate = () => {
      return this.state.selected;
    }
  }

  render() {
    return (
      <table
        style={this.props.style}
        className={'calendar'}
        cellPadding={0}
        cellSpacing={0}
      >
        <thead>
          <CalendarHeader
            currentDate={this.state.date}
            prevMonth={this.prevMonth}
            nextMonth={this.nextMonth}
          />
          <tr>
            {weekDays.map(day => {
              return (
                <th key={day} className={'day-of-the-week'}>
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
                    <td key={tdIndex}>
                      {<DayCell
                          selectDay={this.selectDay}
                          selectedDay={this.state.selected}
                          date={this.state.date}
                          dayOfMonth={day}
                          isFromThisMonth={dayBelongsToCurrentMonth}
                        />}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default CalendarTable;
