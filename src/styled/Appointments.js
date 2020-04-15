import React from "react";
import moment from "moment";
import { FiPlus } from "react-icons/fi";
import Modal from "react-modal";


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

    let data = {};
    return (
        <div className={"Appointment-entry"} style={style} >
            <span className={"Appointment-entryTitle"}>{title}</span>
            <span className={"Appointment-entryTime"}>{time}</span>
            <Modal isOpen={showModal}
                style={modalStyles}
            >
                <AppointmentForm {...appointment} data={data}></AppointmentForm>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={() => setShowModal(false)}>Save</button>
                <button onClick={() => setShowModal(false)}>Delete</button>
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
    const [ _startDate, setStartDate ] = React.useState(startDate ? startDate : "");
    const [ _endDate, setEndDate ] = React.useState(endDate ? endDate : "");
    const [ _begins, setBegins ] = React.useState(begins ? begins : "");
    const [ _ends, setEnds ] = React.useState(ends ? ends : "");
    const [ _people, setPeople ] = React.useState(people ? people : "");
    const [ _location, setLocation ] = React.useState(location ? location: "");
    const [ _description, setDescription ] = React.useState(description ? description: "");

    // Props allows you to pass in an empty object that will be augmented with a method to get the data.
    data.get = () => {
        return {
            title: _title,
            startDate: _startDate,
            endDate: _endDate,
            begins: _begins,
            ends: _ends,
            people: _people,
            location: _location,
            description: _description,
        };
    }

    const firstCol = {
        marginRight: "1em",
    }
    
    return (
        <div class={"AppointmentForm-container"}>
            <div class={"AppointmentForm-row"}>
                <div class={"AppointmentForm-group"}>
                    <Label>Title:</Label><input type={"text"} value={_title} onChange={change(setTitle)}></input>
                </div>
            </div>
            <div class={"AppointmentForm-row"}>
                <div class={"AppointmentForm-group"} style={firstCol}>
                    <Label>Start Date:</Label><input type={"date"} value={_startDate} onChange={change(setStartDate) }></input>
                </div>
                <div class={"AppointmentForm-group"}>
                    <Label>End Date:</Label><input type={"date"} value={_endDate} onChange={change(setEndDate)}></input>
                </div>
            </div>
            <div class={"AppointmentForm-row"}>
                <div class={"AppointmentForm-group"} style={firstCol}>
                    <Label>Begins:</Label><input type={"time"} value={_begins} onChange={change(setBegins)}></input>
                </div>
                <div class={"AppointmentForm-group"}>
                    <Label>Ends:</Label><input type={"time"} value={_ends} onChange={change(setEnds)}></input>
                </div>
            </div>
            <div class={"AppointmentForm-row"}>
                <div class={"AppointmentForm-group"}>
                    <Label>People:</Label><input type={"text"} value={_people} onChange={change(setPeople)}></input>
                </div>
            </div>
            <div class={"AppointmentForm-row"}>
                <div class={"AppointmentForm-group"}>
                    <Label>Location:</Label><input type={"text"} value={_location} onChange={change(setLocation)}></input>
                </div>
            </div>
            <div class={"AppointmentForm-row"}>
                <div class={"AppointmentForm-group"}>
                    <Label>Description:</Label><input type={"text"} value={_description} onChange={change(setDescription)}></input>
                </div>
            </div>
        </div>
    )
    function change(f) {
        return (event) => {
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
                <AppointmentForm data={data}
                ></AppointmentForm>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={() => setShowModal(false)}>Submit</button>
            </Modal>

        </div>
    )
}