import React from 'react';
import './CalendarHeader.css';
import styled from "styled-components";

const Td = styled.td`
    color: white;
    background-color: #0b989d;
    :hover {
      color: white;
      background-color: #0b989d;
    }
`;

const Button = styled.button`
    background-color: transparent;
    color: white;
    
    :hover {
    color: #0b989d;
    background-color: white;
}
`;

const monthNames = ["January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
];

function getMonthName(date){
    return monthNames[date.getMonth()];
}

function getYear(date){
    return date.getFullYear();
}

function getMonthAndYear(date){
    return getMonthName(date) + " " + getYear(date);
}

const arrColspan = 1;
const monthColspan = 5;

class CalendarHeader extends React.Component{
    constructor(props){
        super(props);
        let currentDate = this.props.currentDate;
        this.state = {date: currentDate};
        this.nextMonth = () => props.nextMonth();
        this.prevMonth = () => props.prevMonth();
    }
    render(){
        return(
            <tr>
                <Td colSpan={arrColspan} className={'arrow'} onClick={this.prevMonth}>
                    <Button>&lt;</Button>
                </Td>
                <Td colSpan={monthColspan} className={'date'}>{getMonthAndYear(this.state.date)}</Td>
                <Td colSpan={arrColspan} className={'arrow'} onClick={this.nextMonth}>
                    <Button>&gt;</Button>
                </Td>
            </tr>
        )
    }
}

export default CalendarHeader;