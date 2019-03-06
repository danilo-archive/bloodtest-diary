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
        <Label style={{color: (!isFromThisMonth) ? '#0b989d' : 'white'}}>
          <Button className={'notSelected'}
                  id={`${day}${isFromThisMonth}`}
                  onClick={this.selectDay} >
            {day}
          </Button>
        </Label>
      );
  }
}


export default DayCell;