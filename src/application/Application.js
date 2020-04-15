
/*Interface to the application layer*/

import moment from "moment";
import { Observable } from "rxjs";

var R = require('ramda');

var C = require('chance');
var Chance = new C();

export const Application = {
    do: function(context, action, data) {
        switch (context) {
            case "appointment": 
                return Appointment.do(action, data);
            default: {
                throw new Error("Unknown context");
            }
        }
    }
}


// global store of appointments! May need to replace this later
const appointments = [
    {title: "hi", date: moment().toDate()},
    {title: "bye", date: moment().add(1, "days").toDate() }
];

const externalHandle = {};

const apptObservable = new Observable((subscribe) => {
    externalHandle.next = () => {
        subscribe.next(appointments);
    }
    externalHandle.next();

})


const Appointment = {
    do: (action, data) => {
        switch(action) {
            case "create": 
                data.id = Chance.guid();
                appointments.push(data);
                return ["ok", ""];
            case "update": 
                let appt = R.find((x) => x.id === data.id, appointments);
                if(appt === undefined) {
                    return ["error", "Appointment not found, could not update: " + JSON.stringify(data)];
                } else {
                    Object.assign(appt, data);
                    return ["ok", ""];
                } 
            case "delete": 
                appointments.filter((x) => x.id !== data.id);
                return ["ok", ""]
            case "read":
                let a = R.find((x) => x.id === data.id, appointments);
                if(a === undefined) {
                    return ["error", "Appointment does not exist"]
                } else {
                    return ["ok", a];
                }
            case "query": 
                return Query.do("appointment", data);
            default: {
                return ["error", `'${action}' is not a valid appointment action`]
            }
        }
    }
}


// This would be a really nice place to have a query language interpreter translate the object...
const Query = {
    do: function(context, data) {
        switch(context) {
            case "appointment": {
                switch(data.type) {
                    case "on-date": {
                        const { date } = data;
                        const matches = appointments.filter((appt) => {
                            return moment(appt.startDate).startOf("day").isSame(moment(date).startOf("day"));
                        })
                        return ["ok", matches]; //Returns matches. Mutable, unfortunately.
                    }
                    case "all":
                        //Returns an array of appointments.
                        return ["ok", apptObservable];
                    default: return ["error", "Unknown query type: " + data.type];
                }
            }
            default: {
                return ["error", `'${context}' is not a valid query context`];
            }
        }
    },
}
