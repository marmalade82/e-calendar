import React from "react";
var moment = require('moment')


export default function Months(props) {
    const currentMonth = props.current;
    const monthSet = getMonthSet(currentMonth);

    return (
        <div className={"Months-container"}>
            {renderMonths(monthSet)}
        </div>
    )
}


function getMonthSet(current, months) {
    const monthSet = [ current - 1, current, current + 1].map((month) => {
        return (month + 12) % 12;
    }).map((month) => {
        return moment().month(month).format("MMM");
    })

    return monthSet;

}

function renderMonths(monthSet) {
    return monthSet.map((month) => {
        return (
            <span className="Month-title" key={month}>{month}</span>
        )
    })
}