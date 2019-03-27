import React from 'react';
import styled from "styled-components";

const Arrow = styled.button`

    font-size: 100%;
    padding: 0;
    border: none;
    margin: 0;
    color: white;
    background-color: #0b989d;

    &:hover {
        width: 100%;
        color: #0b989d;
        background-color: white;
        border-radius: 10px
    }
`;


const Header = styled.tr`
  text-align: center;
  color: white;
  font-size: 120%;
  font-weight: bold;
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
    return getMonthName(date) + " " + date.getFullYear();
}

const CalendarHeader = props => {
    return(
        <Header className={'header'}>
            <td colSpan={arrowColSpan}>
                <Arrow onClick={() => props.prevMonth()}>&lt;</Arrow>
            </td>
            <td colSpan={monthColSpan}>{getMonthAndYear(props.currentDate)}</td>
            <td colSpan={arrowColSpan}>
                <Arrow onClick={() => props.nextMonth()}>&gt;</Arrow>
            </td>
        </Header>
    )
}

export default CalendarHeader;
