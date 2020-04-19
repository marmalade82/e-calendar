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
                currentDate={calendarDate}
                style={{
                    marginBottom: "1.5em",
                }}
            ></Months>
            <div className="Calendar-body">
                <div className="Calendar-leftArrow" 
                    onClick={(event) => {
                        event.stopPropagation();
                        onChangeCalendarDate(
                            moment(calendarDate).subtract(1, "month").toDate())
                    }}
                    onDoubleClickCapture={(event) => event.stopPropagation()}
                    onMouseDownCapture={(event) => event.stopPropagation()}
                    style={{
                        flex: 1,
                    }}
                >
                    <FiArrowLeft className="Calendar-leftArrowSymbol"></FiArrowLeft>
                </div>
                <div className="Calendar-aspectRatio"
                    style={{
                        width: "100%",
                        paddingTop: "62%",
                        flex: 8,
                        position: "relative",
                    }}
                >
                    <CalendarBody
                        calendarDate={calendarDate}
                        selectedDate={selectedDate}
                        onChangeDate={onChangeDate}
                        apptDates={apptDates}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                            flex: 0,
                        }}

                    ></CalendarBody>
                </div>
                <div className="Calendar-rightArrow" 
                    onClick={(event) => {
                        event.stopPropagation();
                        onChangeCalendarDate(
                            moment(calendarDate).add(1, "month").toDate())
                    }}
                    onDoubleClickCapture={(event) => event.stopPropagation()}
                    onMouseDownCapture={(event) => event.stopPropagation()}
                    style={{
                        flex: 1,
                    }}
                >
                    <FiArrowRight className="Calendar-rightArrowSymbol"></FiArrowRight>
                </div>
            </div>
        </div>
    )
}