import React from "react";
var moment = require('moment')


export default function Months(props) {
    const { currentDate, style } = props;
    const currentMonth = moment(currentDate).month();
    const monthSet = getMonthSet(currentMonth);

    return (
        <div className={"Months-container"} style={style}>
            <div className={"Months-position"}>
                {renderMonths(monthSet, currentMonth)}
            </div>
        </div>
    )
}


function getMonthSet(current, months) {
    const monthSet = [ current - 1, current, current + 1].map((month) => {
        return (month + 12) % 12;
    });

    return monthSet;

}

function renderMonths(monthSet, currentMonth) {
    return monthSet.map((month) => {
        const className = month === currentMonth ? "Months-activeTitle" : "Months-title";
        const formatted =  moment().month(month).format("MMM");
        return (
            <span className={className} key={formatted}>{formatted}</span>
        )
    })
}