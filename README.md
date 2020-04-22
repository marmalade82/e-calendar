# eCalendar #

The eCalendar is a simple web application that allows the user to create, delete, update, and view appointments from a calendar interface. 

Built with HTML, CSS, and JavaScript (React).

## Features

- Calendar interface
    - Browse the calendar month-by-month using a simple arrow interface
    - Each month is presented with a consistent look and feel
    - Each day can be clicked to view the appointments for that day
    - A dot indicates which days have appointments
- Appointment interface
    - Displays the appointments for a particular day (selected using the Calendar interface)
    - Allows the user to create, view, update, and delete appointments
    - Each appointment can be viewed in more detail:
        - Name
        - Start and end dates/times
        - Description
        - People
        - Location
    - The background image changes to match the season of the selected date
- Responsive styling
    - Currently supports portrait mode for tablets and mobile devices

## Major Dependencies 

- React
- Moment.js
- Ramda
- RxJS
- Chance.js
- Create React App
- Express.js


## Build/Deploy Instructions

Pre-requisites:

- Node >= 10.18.1
- NPM >= 6.13.4

To generate the production build, run `npm run build`. Running `node app-server.js` will deploy on port 5500. To specify another port, like 5001, run `node app-server.js 5001`.

## Contact

Questions/comments can be sent to <hchen7913@gmail.com>