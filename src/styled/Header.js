import React from "react";

export default function Header(props) {
    return (
        <div className={"Header-container"}
        >
            <span className={"Header-title"}>{props.title}</span>
            <span className={"Header-year"}>{props.year}</span>
        </div>
    )
}