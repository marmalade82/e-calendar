import React from 'react';
//import logo from './logo.svg';
import Header from "./styled/Header";
import Calendar from "./styled/Calendar";
import Appointments from "./styled/Appointments";
import Modal from "react-modal";
import moment from "moment";
import './App.css';
import './css/styles.css';

Modal.setAppElement("#root");


function App() {
  const today = moment();

  const [ calendarDate, setCalendarDate ] = React.useState(today.toDate());
  const [ selectedDay, setSelectedDay ] = React.useState(today.toDate());

  return (
    <div id={"app"} className="App-container">
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
      ></Calendar>

      <Appointments
        date = {selectedDay}
        appointments = {[
          {title: "Hi, goat", date: new Date()},
          {title: "bye, goat", date: new Date()}
        ]}
      ></Appointments>
    </div>
  )
}

export default App;
