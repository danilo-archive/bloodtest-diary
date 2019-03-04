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
const arrowColSpan = 1; 
const monthColSpan = 5; 

/**
 * Return the full name of the month from the received date
 * @param {Date} date: date 
 * @return {string} The name of date's month
 */
function getMonthName(date){
    return monthNames[date.getMonth()];
}

/**
 * Return month and year from the received date as string.
 * (Mon Mar 04 2019 ... = March 2019)
 * @param {Date} date: date
 * @return {string} Month and Year as string
 */
function getMonthAndYear(date){
    console.log(date);
    return getMonthName(date) + " " + date.getFullYear();
}

const CalendarHeader = props => {
    return(
        <tr>
            <td colSpan={arrowColSpan} className={'arrow'} onClick={() => props.prevMonth()}>
                <button>&lt;</button>
            </td>
            <td colSpan={monthColSpan} className={'date'}>{getMonthAndYear(props.currentDate)}</td>
            <td colSpan={arrowColSpan} className={'arrow'} onClick={() => props.nextMonth()}>
                <button>&gt;</button>
            </td>
        </tr>
    )
}

export default CalendarHeader;