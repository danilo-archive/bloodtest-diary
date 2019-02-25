import React from 'react';
import './DayCell.css';
//import {render} from 'react-dom'

class DayCell extends React.Component {
  constructor(props){
    super(props);
    this.state = {selected: false};
    this.day = this.props.dayOfMonth;
    this.isFromThisMonth = this.props.isFromThisMonth;
    this.selectDay = () => props.selectDay(this.day);
  }
  
  render(){
      let day = this.day;
      let isFromThisMonth = this.isFromThisMonth;
      return(
        <label style={{color: (!isFromThisMonth) ? '#0b989d' : 'white'}}>
          <button className={'notSelected'} 
                  id={`${day}${isFromThisMonth}`}
                  onClick={this.selectDay} >
            {day}
          </button>
        </label>
      );
  }
}


export default DayCell;