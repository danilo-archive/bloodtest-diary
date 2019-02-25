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
    render(){
        let date = this.props.currentDate;
        let next = this.props.nextMonth;
        let prev = this.props.prevMonth;
        return(
            <tr>
                <td colSpan={arrColspan} className={'arrow'} /*onClick={() => prev()}*/>
                    <button>&lt;</button>
                </td>
                <td colSpan={monthColspan} className={'date'}>{getMonthAndYear(date)}</td>
                <td colSpan={arrColspan} className={'arrow'} onClick={() => next()}>
                    <button>&gt;</button>
                </td>
            </tr>
        )
    }
}

export default CalendarHeader;