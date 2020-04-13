import React from "react";
import moment from "moment";
var R = require('ramda');


export default function CalendarBody(props) {
    return (
        <div className={"CalendarBody-container"}>
            {renderDayTitles()}
            {renderDays(props.currentMonth)}
        </div>
    )
}

function renderDayTitles() {
    const daysOfWeek = R.range(0, 7).map((day) => {
        return moment().day(day).format("ddd");
    })

    return daysOfWeek.map((day, index) => {
        return (
        <span className={"CalendaryBody-dayNumber"} key={index}>{day}</span>
        )
    })
}


function renderDays(currentMonth) {
    const previousMonth = (currentMonth + 12 - 1) % 12;
    const daysInPreviousMonth = moment().month(previousMonth).daysInMonth();
    const prevMonthDays = (function(){ 
        const difference = Math.abs(moment().month(currentMonth).startOf("month").day() - moment().month(currentMonth).startOf("month").startOf("week").day());
        const days = R.takeLast(difference, R.range(1, daysInPreviousMonth + 1));
        return days;
    })().map((day, index) => {
        return (
            <span className={"CalendarBody-inactiveDay"} key={"prev" + index}>{day}</span>
        )
    })

    const daysInMonth = moment().month(currentMonth).daysInMonth();
    const thisMonthDays = R.range(1, daysInMonth + 1).map((day, index) => {
        return (
            <span className={"CalendarBody-activeDay"} key={"current" + index}>{day}</span>
        )
    })


    const nextMonth = (currentMonth + 12 + 1) % 12;
    const daysInNextMonth = moment().month(nextMonth).daysInMonth();
    const nextMonthDays = (function() {
        const difference = Math.abs(moment().month(currentMonth).endOf("month").day() - moment().month(currentMonth).endOf("month").endOf("week").day());
        const days = R.take(difference, R.range(1, daysInNextMonth));
        return days;
    })().map((day, index) => {
        return (
            <span className={"CalendarBody-inactiveDay"} key={"next" + index}>{day}</span>
        )
    })

    return R.concat(R.concat(prevMonthDays, thisMonthDays), nextMonthDays);
}