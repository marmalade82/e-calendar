import React from "react";
import moment from "moment";
import { FiPlus } from "react-icons/fi";
import Modal from "react-modal";
import { Application } from "../application/Application";


const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        padding: "0",
        top: '300px',
        left: '300px',
        //right: '300px',
        //bottom: '300px',
    }
}

export default function Appointments(props) {
    const { appointments, date, style } = props;
    return (
        <div className={"Appointments-container"} style={style}>
            <AppointmentDate date={date} style={{
                marginTop: "1em",
                marginBottom: "1em",
            }}></AppointmentDate>
            <AppointmentsBody appointments={appointments}></AppointmentsBody>
            <AddAppointment></AddAppointment>
        </div>
    )
}

function AppointmentDate(props) {
    const { date, style } = props;
    const dayName = moment(date).format("dddd")
    const formatted = moment(date).format("MMMM Do")

    return (
        <div className={"AppointmentDate-container"} style={style}>
            <span className={"AppointmentDate-day"}>{dayName}</span>
            <span className={"AppointmentDate-date"}>{formatted}</span>
        </div>
    )
}

function AppointmentsBody(props) {
    const { appointments, style } = props;

    return (
        <div className={"AppointmentsBody-container"} style={style}>
            <div className={"AppointmentsBody-background"}>
                {renderAppointments(appointments)}
            </div>
        </div>
    )

    function renderAppointments(appointments) {

        return appointments.map((appointment) => {
            const {title, startDate, begins} = appointment;
            console.log(appointment);
            return (
                <Appointment appointment={appointment} key={appointment.id ? appointment.id : title + startDate.toString()}></Appointment>
            )
        })
    }
}

function Appointment(props) {
    const [showModal, setShowModal] = React.useState(false);
    const { appointment, style } = props;
    const {title, startDate} = props.appointment;
    const time = moment(startDate).format("h:mm A");

    let data = {};

    function closeModal(event) {
        event.stopPropagation();
        setShowModal(false);
    }

    return (
        <div className={"Appointment-entry"} style={style} 
            onClick={(event) => {
                setShowModal(true);
            }
        }>
            <span className={"Appointment-entryTitle"}>{title}</span>
            <span className={"Appointment-entryTime"}>{time}</span>
            <Modal isOpen={showModal}
                style={modalStyles}
            >
                <AppointmentForm {...appointment} data={data}></AppointmentForm>
                <button onClick={closeModal} >Cancel</button>
            </Modal>
        </div>
    )
}

function AppointmentForm(props) {
    // Set initial values based on props;
    const {
        title, startDate, endDate, begins, ends, people, location, description,
        data,
    } = props;

    const [ _title, setTitle ] = React.useState(title ? title : "");
    const [ _startDate, setStartDate ] = React.useState(startDate ? moment(startDate).format("YYYY-MM-DD") : "");
    const [ _endDate, setEndDate ] = React.useState(endDate ? moment(endDate).format("YYYY-MM-DD") : "");
    const [ _begins, setBegins ] = React.useState(begins ? moment(begins).format("HH:mm") : "");
    const [ _ends, setEnds ] = React.useState(ends ? moment(ends).format("HH:mm") : "");
    const [ _people, setPeople ] = React.useState(people ? people : "");
    const [ _location, setLocation ] = React.useState(location ? location: "");
    const [ _description, setDescription ] = React.useState(description ? description: "");

    // Props allows you to pass in an empty object that will be augmented with a method to get the data.
    data.get = () => {
        return {
            title: _title,
            startDate: moment(_startDate, "YYYY-MM-DD").toDate(),
            endDate: moment(_endDate, "YYYY-MM-DD").toDate(),
            begins: moment(_begins, "HH:mm").toDate(),
            ends: moment(_ends, "HH:mm").toDate(),
            people: _people,
            location: _location,
            description: _description,
        };
    }

    const firstCol = {
        marginRight: "1em",
    }
    
    return (
        <div className={"AppointmentForm-container"}>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"}>
                    <Label>Title:</Label><input type={"text"} value={_title} onChange={change(setTitle)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"} style={firstCol}>
                    <Label>Start Date:</Label><input type={"date"} value={_startDate} onChange={change(setStartDate) }></input>
                </div>
                <div className={"AppointmentForm-group"}>
                    <Label>End Date:</Label><input type={"date"} value={_endDate} onChange={change(setEndDate)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"} style={firstCol}>
                    <Label>Begins:</Label><input type={"time"} value={_begins} onChange={change(setBegins)}></input>
                </div>
                <div className={"AppointmentForm-group"}>
                    <Label>Ends:</Label><input type={"time"} value={_ends} onChange={change(setEnds)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"}>
                    <Label>People:</Label><input type={"text"} value={_people} onChange={change(setPeople)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"}>
                    <Label>Location:</Label><input type={"text"} value={_location} onChange={change(setLocation)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"}>
                    <Label>Description:</Label><input type={"text"} value={_description} onChange={change(setDescription)}></input>
                </div>
            </div>
        </div>
    )
    function change(f) {
        return (event) => {
            console.log(JSON.stringify(event.target.value));
            f(event.target.value);
        }
    }
}

function Label(props) {
    const { children } = props;

    return (
        <div className={"AppointmentForm-label"}>
            <label >{children}</label>
        </div>
    )
}

function AddAppointment(props) {
    const [showModal, setShowModal] = React.useState(false);
    const [message, setShowMessage] = React.useState("");
    const { style } = props;

    let data = {}

    return (
        <div className={"AddAppointment-container"} style={style}>
            <div className={"AddAppointment-plus"} onClick={() => setShowModal(true)}>
                <FiPlus className="AddAppointment-plusSymbol"></FiPlus>
            </div>        
            <Modal isOpen={showModal}
                style={modalStyles}
            >
                <div className={"AddAppointment-errorContainer"}>
                    <span className={"AddAppointment-error"}>{message}</span>
                </div>
                <AppointmentForm data={data}
                ></AppointmentForm>
                <button onClick={() => {
                        setShowModal(false)
                        setShowMessage(""); 
                    }}
                >Cancel</button>
                <button onClick={() => {
                    console.log(data.get());
                    const [code, result] = Application.do("appointment", "create", data.get());
                    if(code === "ok") {
                        setShowModal(false);
                        setShowMessage("");
                    } else {
                        setShowMessage(result.toString());
                    }
                }}>Submit</button>
            </Modal>

        </div>
    )
}