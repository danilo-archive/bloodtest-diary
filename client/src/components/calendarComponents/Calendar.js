import React, { Component } from "react";
import { getCalendar } from "../../lib/calendar-functions.js";
import DayCell from "./DayCell.js";
import CalendarHeader from "./CalendarHeader.js";
import styled from "styled-components";

const Calendar = styled.table`

  position: absolute;
  width: 300px;
  height: auto;
  left: 50%;
  background-color: #0b989d;
  margin: 0;
  margin-top: 20px;
  padding-bottom: 1%;
  padding-top: 1%;
  padding-right: 1%;
  padding-left: 1%;
  table-layout: fixed;
  border-radius: 20px;
  white-space: nowrap;
  opacity: 1;
  box-shadow: 10px 10px 50px;
  z-index: 11;

  & td {
    padding: 10px;
  }
`;


const Day = styled.th`
  padding: 15px;
  color: #0b989d;
  background-color: white;
  line-height: 0;
  text-align: left;
`;

const HALF_MONTH = 15;
const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

let dayBelongsToCurrentMonth = false;

class CalendarTable extends Component {
  constructor(props) {
    super(props);
    const currentDate = (props.selectedDate) ? props.selectedDate : new Date();
    this.state = {
      date: currentDate,
      calendar: getCalendar(currentDate),
      selected: props.selectedDate,
      isVisible: true,
    };
    this.firstSwitch = true;
    this.preventSelectedToChange = this.preventSelectedToChange;
    this.select = this.select;
    this.nextMonth = this.nextMonth;
    this.prevMonth = this.prevMonth;


    //prevents selected day to change on first month change
    this.preventSelectedToChange = (date,monthCorrector) => {
      if(this.firstSwitch){
        this.firstSwitch = false;
        this.setState({selected: new Date(date.setMonth(date.getMonth() + monthCorrector))});
      }
    };

    this.prevMonth = () => {
      const date = this.state.date;
      const newDate = new Date(date.setMonth(date.getMonth() - 1));
      this.setState({
        date: newDate,
        calendar: getCalendar(newDate),
      });
      this.preventSelectedToChange(date,1);
    };

    this.nextMonth = () => {
      const date = this.state.date;
      const newDate = new Date(date.setMonth(date.getMonth() + 1));
      this.setState({
        date: newDate,
        calendar: getCalendar(newDate),
      });
      this.preventSelectedToChange(date,-1);
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

      const selectedDay = new Date(`${year}-${month}-${day}`);

      if (this.props.setSelectedDate){
        this.props.setSelectedDate(selectedDay);
      }
      if (this.props.onDayPick) {
        this.props.onDayPick(selectedDay);
      }
      this.setState({selected: selectedDay});
    };
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    if(this.props.outsideClick){
      this.props.outsideClick();
    }else{
      this.setState({isVisible: false});
    }
  }

  render() {
    return (
      this.state.isVisible && (
        <Calendar
          ref={node => this.node = node}
          style={this.props.style}
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
                  <Day key={day}>
                    {day}
                  </Day>
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
        </Calendar>
      )
    );
  }
}

export default CalendarTable;
