import React, { Component } from 'react';
import styled from "styled-components";

import CalendarTable from "../calendarComponents/Calendar";
import calendarIcon from "../../images/calendar.png";

const Container = styled.div`

vertical-align: middle;
font-size: 1.05rem;
height: 11px;
width: 200px;
display: flex;
align-items: center;
margin-left: 10px;
font-family: "Rajdhani", sans-serif;
color: black;
text-align: center;

.calendar-icon {
border: none;
height: 40px;
color: #1b1b1b;
font-size: 15px;
outline: none;
margin-left: 20px;
margin-right: 10px;
margin-bottom: 3px;
}

.calendar-icon:not(:placeholder-shown) + .label {
font-size: 0px;
top: 5px;
color: v;
}

.calendar-icon:focus ~ .label {
font-size: 0px;
top: 5px;
color:  #97a9a9;
transition: all 0.5s ease;
}

.calendar-icon:focus ~ .highlight {
width: calc(100% - 50px);
transition: all 1s ease;
}
`;

export default class SearchBar extends Component {
    constructor(props){
        super(props);
        this.state = {
          showCalender: false,
        };
        this.closeCalendar = () => {
          this.setState = {
            showCalender: true,
          };
          console.log(this.state.showCalender)
        }
    }

    render(){
      return (
      <Container>
              <img className={"calendar-icon"}
                   alt={"Calendar"} 
                   src={calendarIcon}
                   onClick= {() => {this.setState({ showCalendar: !this.state.showCalendar })}}
              />
              Date picker

        {this.state.showCalendar ? (
          <CalendarTable closeCalendar={this.closeCalendar}/>
        ) : (
          <></>
        )}

      </Container>
      )
    }
}
