import React from "react";
import moment from "moment";
import { FiPlus } from "react-icons/fi";
import Modal from "react-modal";


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
            const {title, date} = appointment;
            return (
                <Appointment appointment={appointment} key={title + date.toString()}></Appointment>
            )
        })
    }
}

function Appointment(props) {
    const [showModal, setShowModal] = React.useState(false);
    const { appointment, style } = props;
    const {title, date} = props.appointment;
    const time = moment(date).format("h:mm A");
    return (
        <div className={"Appointment-entry"} style={style} >
            <span className={"Appointment-entryTitle"}>{title}</span>
            <span className={"Appointment-entryTime"}>{time}</span>
            <Modal isOpen={showModal}>
                <AppointmentForm {...appointment}></AppointmentForm>
                <button onClick={() => setShowModal(false)}>Close Modal</button>
            </Modal>
        </div>
    )
}

function AppointmentForm(props) {
    const {
        title, startDate, endDate, begins, ends, people, location, description,
    } = props;

    const [ _title, setTitle ] = React.useState(title ? title : "");
    const [ _startDate, setStartDate ] = React.useState(startDate ? startDate : "");
    const [ _endDate, setEndDate ] = React.useState(endDate ? endDate : "");
    const [ _begins, setBegins ] = React.useState(begins ? begins : "");
    const [ _ends, setEnds ] = React.useState(ends ? ends : "");
    const [ _people, setPeople ] = React.useState(people ? people : "");
    const [ _location, setLocation ] = React.useState(location ? location: "");
    const [ _description, setDescription ] = React.useState(description ? description: "");
    
    return (
        <React.Fragment>
            <label>Title</label><input value={_title}></input>
            <label>Start Date</label><input value={_startDate}></input>
            <label>End Date</label><input value={_endDate}></input>
            <label>Begins</label><input value={_begins}></input>
            <label>Ends</label><input value={_ends}></input>
            <label>People</label><input value={_people}></input>
            <label>Location</label><input value={_location}></input>
            <label>Description</label><input value={_description}></input>
        </React.Fragment>

    )
}

function AddAppointment(props) {
    const [showModal, setShowModal] = React.useState(false);
    const { style } = props;

    return (
        <div className={"AddAppointment-container"} style={style}>
            <div className={"AddAppointment-plus"} onClick={() => setShowModal(true)}>
                <FiPlus className="AddAppointment-plusSymbol"></FiPlus>
            </div>        
            <Modal isOpen={showModal}>
                <AppointmentForm
                ></AppointmentForm>
                <button onClick={() => setShowModal(false)}>Close Modal</button>
            </Modal>

        </div>
    )
}