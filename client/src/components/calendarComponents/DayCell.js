import React from 'react';
import './DayCell.css';
//import {render} from 'react-dom'
import styled from "styled-components";

const Button = styled.button`
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    margin: 0;
    font-size: 100%;
    color: white;
    background-color: #0b989d;
    /* border-radius: 50%; */
    
    :hover {
      background-color: #0b989d;
    }
`;

const Label = styled.label`
    width: 100%;
    background-color: inherit;
    font-size: 90%;
    color: inherit;
`;

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
