import React from "react";
import moment from "moment";
import { FiPlus } from "react-icons/fi";
import Modal from "react-modal";
import { Application } from "../application/Application";

const isScreen = window.matchMedia("(min-width: 850px)");
const isTablet = window.matchMedia("(max-width: 850px) and (min-width: 400px)");
const isMobile = window.matchMedia("(max-width: 400px)");

const modalScreenStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        position: "static",
        padding: 0,
        width: "800px",
    }
}

const modalTabletStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        position: "static",
        padding: 0,
        width: "100%",
    }
}

const modalMobileStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        position: "static",
        padding: 0,
        width: "100%",
    }
}

function getSeason(date) {
    let s = Math.floor(((moment(date).month() - 2 + 12) % 12) / 3);
    return s;
}

export default function Appointments(props) {
    const { appointments, date, style } = props;
    const [ prevSeason, setPrevSeason ] = React.useState(getSeason(date));
    const [ modalStyles, setModalStyles] = React.useState(
        isScreen.matches ? modalScreenStyles : 
        isTablet.matches ? modalTabletStyles : 
        isMobile.matches ? modalMobileStyles : 
            modalScreenStyles);

    React.useEffect(() => {
        const screen = (e) => {
            if(e.matches) setModalStyles(modalScreenStyles);
        }
        isScreen.addListener(screen);

        const tablet = (e) => {
            if(e.matches) setModalStyles(modalTabletStyles);
        };
        isTablet.addListener(tablet)

        const mobile = (e) => {
            if(e.matches) setModalStyles(modalMobileStyles);
        };
        isMobile.addListener(mobile)

        return () => {
            isScreen.removeListener(screen)
            isTablet.removeListener(tablet);
            isMobile.removeListener(mobile);
        }
    }, [])


    React.useEffect(() => {
        setPrevSeason(getSeason(date));
    }, [date]);

    const apptsForDay = appointments.filter((appt) => {
        return moment(appt.startDate).startOf("day").isSame(moment(date).startOf("day"));
    }).sort((a, b) => {
        return a.begins.valueOf() - b.begins.valueOf();
    })

    // We transition the background image based on the current month:
    // Dec-Feb (11 - 1) : Winter
    // Mar-May (2 - 4): Spring
    // Jun-Aug (5 - 7): Summer
    // Sep-Nov (8 - 10): Fall
    return (
        <div className={"Appointments-container"} style={style}>
            {renderImage(date, prevSeason)}
            <AppointmentDate date={date} style={{
                marginTop: "1em",
                marginBottom: "1em",
            }}></AppointmentDate>
            <AppointmentsBody appointments={apptsForDay}
                modalStyles={modalStyles}>
            </AppointmentsBody>
            <AddAppointment startDate={date}
                modalStyles={modalStyles}
            >
            </AddAppointment>
        </div>
    )

    function renderImage(date, prevSeason) {
        let season = getSeason(date);

        return (
            <React.Fragment>
                <img className={classes(0, season, prevSeason)} src={"./images/spring.jpg"} alt={"spring"}></img>
                <img className={classes(1, season, prevSeason)} src={"./images/summer.jpg"} alt={"summer"}></img>
                <img className={classes(2, season, prevSeason)} src={"./images/fall.jpg"} alt={"fall"}></img>
                <img className={classes(3, season, prevSeason)} src={"./images/winter.jpg"} alt={"winter"}></img>
            </React.Fragment>
        )

        function classes(season, actual, prev) {
            let classes = [];
            if(season === actual) {
                classes.push("Appointments-activeSeason");
            } else {
                classes.push("Appointments-inactiveSeason");
                if(season === prev) {
                    classes.push("Appointments-prevSeason")
                }
            }

            return classes.join(" ");
        }
    }
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
    const { appointments, style, modalStyles } = props;

    return (
        <div className={"AppointmentsBody-container"} style={style}>
            <div className={"AppointmentsBody-background"}>
                {renderAppointments(appointments)}
            </div>
        </div>
    )

    function renderAppointments(appointments) {
        if(appointments.length > 0) {
            return appointments.map((appointment) => {
                const {title, startDate, begins} = appointment;
                return (
                    <Appointment appointment={appointment} 
                        key={appointment.id ? appointment.id : title + startDate.toString() + begins.toString()}
                        modalStyles={modalStyles}
                    ></Appointment>
                )
            })
        } else {
            return (
                <div className={"Appointment-noEntry"}>
                    <span className={"Appointment-entryTitle"}>
                        No Appointments
                    </span>
                </div>
            )
        }

    }
}

function Appointment(props) {
    const [showModal, setShowModal] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const { appointment, style, modalStyles } = props;
    const {title, begins} = props.appointment;
    const time = moment(begins).format("h:mm A");

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
                <div className={"AddAppointment-errorContainer"}
                    style={{
                        flex: 1,
                        padding: "2em 2em 0 2em",
                    }}>
                    <span className={"AddAppointment-error"} style={{
                        display: "inline-block",
                        height: "1em",
                    }}>{" " + message}</span>
                </div>
                <AppointmentForm {...appointment} data={data}
                    style={{
                        paddingTop: "1em",
                        paddingBottom: "1em",
                    }}
                ></AppointmentForm>
                <div className={"AddAppointment-buttons"} style={{ }}>
                    <button onClick={(event) => {
                            setMessage("");
                            closeModal(event);
                        }} 
                        style={{ }}
                        className="form-button"
                    >Cancel</button>
                    <button onClick={(event) => {
                            let d = data.get();
                            d.id = appointment.id;
                            const [code, result] = Application.do("appointment", "update", d);
                            if(code === "ok") {
                                closeModal(event);
                                setMessage("");
                            } else {
                                setMessage(result);
                            }
                        }}
                        style={{ }}
                        className="form-button"
                    >Save</button>
                    <button onClick={(event) => {
                            const [code, result] = Application.do("appointment", "delete", appointment)
                            if(code === "ok") {
                                closeModal(event);
                                setMessage("");
                            } else {
                                setMessage(result);
                            }
                        }} 
                        style={{ }}
                        className="form-button"
                    >Delete</button>
                </div>
            </Modal>
        </div>
    )
}

function AppointmentForm(props) {
    // Set initial values based on props;
    const {
        title, startDate, endDate, begins, ends, people, location, description,
        data, style
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

    return (
        <div className={"AppointmentForm-container"}
            style={style}
        >
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group"}>
                    <Label>Title:</Label><input type={"text"} value={_title} onChange={change(setTitle)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group AppointmentForm-firstCol"}>
                    <Label>Start Date:</Label><input type={"date"} value={_startDate} onChange={change(setStartDate) }></input>
                </div>
                <div className={"AppointmentForm-group"}>
                    <Label>End Date:</Label><input type={"date"} value={_endDate} onChange={change(setEndDate)}></input>
                </div>
            </div>
            <div className={"AppointmentForm-row"}>
                <div className={"AppointmentForm-group AppointmentForm-firstCol"}>
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
    const { style, startDate, modalStyles } = props;

    let data = {}

    return (
        <div className={"AddAppointment-container"} style={style}>
            <div className={"AddAppointment-plus"} onClick={() => setShowModal(true)}>
                <FiPlus className="AddAppointment-plusSymbol"></FiPlus>
            </div>        
            <Modal isOpen={showModal}
                style={modalStyles}
            >
                <div className={"AddAppointment-errorContainer"}
                    style={{
                        flex: 1,
                        padding: "2em 2em 0 2em",
                    }}>
                    <span className={"AddAppointment-error"} style={{
                        display: "inline-block",
                        height: "1em",
                    }}>{" " + message}</span>
                </div>
                <AppointmentForm data={data}
                    startDate={startDate}
                    style={{
                        paddingTop: "1em",
                        paddingBottom: "1em",
                    }}
                ></AppointmentForm>
                <div className={"AddAppointment-buttons"} style={{ }}>
                    <button onClick={(event) => {
                            event.stopPropagation();
                            setShowModal(false)
                            setShowMessage(""); 
                        }}
                        style={{ }}
                        className="form-button"
                    >Cancel</button>
                    <button onClick={(event) => {
                            event.stopPropagation();
                            const [code, result] = Application.do("appointment", "create", data.get());
                            if(code === "ok") {
                                setShowModal(false);
                                setShowMessage("");
                            } else {
                                setShowMessage(result.toString());
                            }
                        }}
                        style={{ }}
                        className="form-button"
                    >Submit</button>
                </div>
            </Modal>

        </div>
    )
}