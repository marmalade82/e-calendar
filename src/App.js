import React from 'react';
//import logo from './logo.svg';
import Header from "./styled/Header";
import Calendar from "./styled/Calendar";
import Appointments from "./styled/Appointments";
import { Application } from "./application/Application";
import Modal from "react-modal";
import moment from "moment";
import './App.css';
import './css/styles.css';

Modal.setAppElement("#root");


function App() {
  const today = moment();

  const [ calendarDate, setCalendarDate ] = React.useState(today.toDate());
  const [ selectedDay, setSelectedDay ] = React.useState(today.toDate());

  const [ apptDates, setApptDates ] = React.useState({});
  const [ appointments, setAppointments ] = React.useState([]);

  React.useEffect(() => {
    // On mount, we subscribe to the Application layer's query about ALL appointments.
    (() => {
        const [code, obs] = Application.do("appointment", "query", {
          type: "all",
        })

        if(code === "ok") {
          obs.subscribe((appts) => {
            console.log("rerendering appointments!")
            setAppointments(appts)
          })
        }
      })(); 

    (() => {
        const [code, obs] = Application.do("dates", "query", {
          type: "has-appointments",
        })

        if(code === "ok") {
          obs.subscribe((dates) => {
            setApptDates(dates);
          })
        }
    })();
  }, [])

  return (
    <div id={"app"} className="App-container" style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: true,
        justifyContent: "flex-start",
        alignItems: "stretch",
    }}>
        <div className="App-calendar" style={{
          display: "flex",
          flexDirection: "column",
          flex: 2,
        }}>
          <Header
            title={"eCalendar"}
            year={moment(calendarDate).format("YYYY")}
          ></Header>

          <Calendar
            calendarDate={calendarDate}
            onChangeCalendarDate={(date) => setCalendarDate( date )}
            selectedDate={selectedDay}
            onChangeDate={(date) => { 
              setSelectedDay(date)

              if(moment(date).endOf("month").isBefore(calendarDate) || 
                moment(date).startOf("month").isAfter(calendarDate)) {
                setCalendarDate(date);
              }
            }}
            apptDates={apptDates}
          ></Calendar>
        </div>

      <Appointments
        date = {selectedDay}
        appointments = {
          appointments
        }
        style={{
          flex: 1
        }}
      ></Appointments>
    </div>
  )
}

export default App;
