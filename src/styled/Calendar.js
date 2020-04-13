import React from "react"
import Months from "./Months";
import CalendarBody from "./CalendarBody";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function Calendar(props) {

    return (
        <div className="Calendar-container">
            <Months
                current={props.currentMonth}
            ></Months>
            <div className="Calendar-body">
                <div className="Calendar-leftArrow">
                    <FiArrowLeft></FiArrowLeft>
                </div>
                <CalendarBody
                    currentMonth={props.currentMonth}
                ></CalendarBody>
                <div className="Calendar-rightArrow">
                    <FiArrowRight></FiArrowRight>
                </div>
            </div>
        </div>
    )
}