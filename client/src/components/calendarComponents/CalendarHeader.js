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
}

export default CalendarHeader;