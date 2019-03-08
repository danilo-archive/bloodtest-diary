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
    console.log(monthNames[date.getMonth()])
    return monthNames[date.getMonth()];
}

function getYear(date){
    return date.getFullYear();
}

function getMonthAndYear(date){
    return getMonthName(date) + " " + getYear(date);
}

const arrColSpan = 1;
const monthColSpan = 5;

<<<<<<< HEAD
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
=======
const CalendarHeader = props => {
    return(
        <tr>
            <td colSpan={arrColSpan} className={'arrow'} onClick={() => props.prevMonth()}>
                <button>&lt;</button>
            </td>
            <td colSpan={monthColSpan} className={'date'}>{getMonthAndYear(props.currentDate)}</td>
            <td colSpan={arrColSpan} className={'arrow'} onClick={() => props.nextMonth()}>
                <button>&gt;</button>
            </td>
        </tr>
    )
>>>>>>> 6e76bac140c4099464bd4a70999f55622726ff62
}

export default CalendarHeader;