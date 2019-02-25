import React from 'react';
import './CalendarHeader.css';

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
                <td colSpan={arrColspan} className={'arrow'} onClick={this.prevMonth}>
                    <button>&lt;</button>
                </td>
                <td colSpan={monthColspan} className={'date'}>{getMonthAndYear(this.state.date)}</td>
                <td colSpan={arrColspan} className={'arrow'} onClick={this.nextMonth}>
                    <button>&gt;</button>
                </td>
            </tr>
        )
    }
}

export default CalendarHeader;