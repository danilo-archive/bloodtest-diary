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
    console.log(monthNames[date.getMonth()])
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
        <tr className={'header'}>
            <td colSpan={arrowColSpan}>
                <button className={'arrow'}
                        onClick={() => props.prevMonth()}>&lt;</button>
            </td>
            <td colSpan={monthColSpan}>{getMonthAndYear(props.currentDate)}</td>
            <td colSpan={arrowColSpan}>
                <button className={'arrow'}
                        onClick={() => props.nextMonth()}>&gt;</button>
            </td>
        </tr>
    )
}

export default CalendarHeader;
