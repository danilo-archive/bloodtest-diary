import React from "react";
import "./DayCell.css";
//import {render} from 'react-dom'

class DayCell extends React.Component {
  render() {
    let day = this.props.dayOfMonth;
    let isFromThisMonth = this.props.isFromThisMonth;
    return (
      <label style={{ color: !isFromThisMonth ? "#0b989d" : "white" }}>
        <button
          className={"notSelected"}
          id={`${day}${isFromThisMonth}`}
          onClick={() => {
            this.props.onClick(day);
          }}
        >
          {day}
        </button>
      </label>
    );
  }
}

export default DayCell;
