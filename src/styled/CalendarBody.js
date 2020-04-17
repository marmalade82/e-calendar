import React from "react";
import moment from "moment";
var R = require('ramda');


export default function CalendarBody(props) {
    const { selectedDate, onChangeDate, calendarDate, apptDates, style } = props;
    return (
        <div className={"CalendarBody-container"} style={style}>
            {renderDayTitles()}
            {renderDays(calendarDate, selectedDate, onChangeDate, apptDates)}
        </div>
    )
}

function renderDayTitles() {
    const daysOfWeek = R.range(0, 7).map((day) => {
        return moment().day(day).format("ddd");
    })

    let renderedDays = daysOfWeek.map((day, index) => {
        return (
            <div className={"CalendarBody-dayBox"} key={index}>
                <span className={"CalendarBody-dayNumber"} key={index}>{day}</span>
            </div>
        )
    });
    return (
        <div className={"CalendarBody-row"}>
            {renderedDays}
        </div>
    );
}


function renderDays(calendarDate, selectedDate, onChangeDate, apptDates) {
    // If the date of any of the days matches the selected date, we need to make it look special.
    // Also all of the activeDates can be selected as a new Date.

    const previousMonth = moment(calendarDate).subtract(1, "month");
    const currentMonth = moment(calendarDate);
    const nextMonth = moment(calendarDate).add(1, "month");

    const prevMonthDays = (function(){ 
        const daysInPreviousMonth = previousMonth.daysInMonth();
        const difference = Math.abs(moment(currentMonth).startOf("month").day() - moment(currentMonth).startOf("month").startOf("week").day());
        const days = R.takeLast(difference, R.range(1, daysInPreviousMonth + 1));
        return days;
    })().map((day, index) => {
        // NEED TO REWORK THIS. YEAR SHOULD CHANGE AS WELL.
        return {
            date: makeDate(previousMonth, day),
            component: ( 
                <span className={"CalendarBody-inactiveDay"} key={"prev" + index}>{day}</span>
            )
        }
        
    })

    const daysInMonth = moment(currentMonth).daysInMonth();
    const thisMonthDays = R.range(1, daysInMonth + 1).map((day, index) => {
        return {
          date: makeDate(currentMonth, day),
          active: true,
          component: <span className={"CalendarBody-activeDay"} key={"current" + index}>{day}</span>
        }
    })

    const nextMonthDays = (function() {
        const daysInNextMonth = moment(nextMonth).daysInMonth();
        const difference = Math.abs(moment(currentMonth).endOf("month").day() - moment(currentMonth).endOf("month").endOf("week").day());
        const days = R.take(difference, R.range(1, daysInNextMonth));
        return days;
    })().map((day, index) => {
        return {
            date: makeDate(nextMonth, day),
            component: <span className={"CalendarBody-inactiveDay"} key={"next" + index}>{day}</span>
        }
    })

    const all = R.concat(R.concat(prevMonthDays, thisMonthDays), nextMonthDays);
    const wrapped = all.map((dayObj, index) => {
        return (
            <div className={classes(dayObj)} onClick={() => onChangeDate(dayObj.date)}
                key={index}
            >
                {dayObj.component}
                {ApptIcon(dayObj.date, apptDates)}
            </div>
        )

        function classes(dayObj) {
            let classes = ["CalendarBody-dayBox"];
            if(moment(dayObj.date).startOf("day").isSame(moment(selectedDate).startOf("day"))) {
                classes.push("CalendarBody-selectedDay")
            }

            if(dayObj.active) {
                classes.push("CalendarBody-activeDayBox")
            }

            return classes.join(' ');
        }

        function ApptIcon(date, apptDates) {
            if (R.find(sameDay, apptDates) !== undefined) {
                return <span>i</span>
            }

            return null;

            function sameDay(apptDate) {
                return moment(apptDate).startOf("day").isSame(moment(date).startOf("day"));
            }
        }
    });
    
    return R.splitEvery(7, wrapped).map((wrapper, index) => {
        return (
            <div className={"CalendarBody-row"} key={"row-" + index}>
                {wrapper}
            </div> 
        )
    })
}

function makeDate(mom, day) {
    return moment(mom).date(day).toDate();
}