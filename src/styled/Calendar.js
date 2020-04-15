import React from "react"
import Months from "./Months";
import CalendarBody from "./CalendarBody";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
var moment = require("moment");

export default function Calendar(props) {
    const { 
        onChangeCalendarDate, calendarDate, onChangeDate, selectedDate,
        apptDates
    } = props;

    return (
        <div className="Calendar-container">
            <Months
                current={calendarDate}
            ></Months>
            <div className="Calendar-body">
                <div className="Calendar-leftArrow" 
                    onClick={() => onChangeCalendarDate(
                        moment(calendarDate).subtract(1, "month").toDate())
                    }
                >
                    <FiArrowLeft className="Calendar-leftArrowSymbol"></FiArrowLeft>
                </div>
                <CalendarBody
                    calendarDate={calendarDate}
                    selectedDate={selectedDate}
                    onChangeDate={onChangeDate}
                    apptDates={apptDates}

                ></CalendarBody>
                <div className="Calendar-rightArrow" 
                    onClick={() => onChangeCalendarDate(
                        moment(calendarDate).add(1, "month").toDate())
                    }
                >
                    <FiArrowRight className="Calendar-rightArrowSymbol"></FiArrowRight>
                </div>
            </div>
        </div>
    )
}