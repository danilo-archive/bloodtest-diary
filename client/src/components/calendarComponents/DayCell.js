import React from 'react';
import './DayCell.css';
//import {render} from 'react-dom'

const DayCell = props => {
      let day = props.dayOfMonth;
      let isFromThisMonth = props.isFromThisMonth;
      return(
        <label style={{color: (!isFromThisMonth) ? '#0b989d' : 'white'}}>
          <button className={'notSelected'}
                  id={`${day}${isFromThisMonth}`}
                  onClick={() => props.selectDay(day, isFromThisMonth)} >
            {day}
          </button>
        </label>
      );
  }



export default DayCell;
