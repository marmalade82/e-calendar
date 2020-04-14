import React from 'react';
//import logo from './logo.svg';
import Header from "./styled/Header";
import Calendar from "./styled/Calendar";
import Appointments from "./styled/Appointments";
import Modal from "react-modal";
import './App.css';
import './css/styles.css';

Modal.setAppElement("#root");


function App() {
  return (
    <div id={"app"} className="App-container">
      <Header
        title={"eCalendar"}
        year={"2021"}
      ></Header>

      <Calendar
        currentMonth={3}
      ></Calendar>

      <Appointments
        date = {new Date()}
        appointments = {[
          {title: "Hi, goat", date: new Date()},
          {title: "bye, goat", date: new Date()}
        ]}
      ></Appointments>
    </div>
  )
  /*
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );*/
}

export default App;
