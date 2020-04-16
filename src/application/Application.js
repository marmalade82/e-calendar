
/*Interface to the application layer*/

import moment from "moment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

var R = require('ramda');

var C = require('chance');
var Chance = new C();

export const Application = {
    do: function(context, action, data) {
        switch (context) {
            case "appointment": 
                return Appointment.do(action, data);
            case "dates": 
                return Dates.do(action, data);
            default: {
                throw new Error("Unknown context");
            }
        }
    }
}


// global store of appointments! May need to replace this later
let appointments = [
    {id: "1", title: "hi", startDate: moment().toDate(), begins: moment().add(35, "minutes").toDate()},
    {id: "2", title: "bye", startDate: moment().add(2, "days").toDate(), begins: moment().add(35, "minutes").toDate() }
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
                const [code, result] = Validate.do("appointment", "create", data);
                if(code === "ok")  {
                    result.id = Chance.guid();
                    appointments.push(result);
                    externalHandle.next();
                    return ["ok", result];
                } else {
                    return [code, result]
                }

            case "update": 
                console.log("updating");
                let appt = R.find((x) => x.id === data.id, appointments);
                if(appt === undefined) {
                    return ["error", "Appointment not found, could not update: " + JSON.stringify(data)];
                } else {
                    const [code, result] = Validate.do("appointment", "update", data);
                    if(code === "ok") {
                        Object.assign(appt, result);
                        externalHandle.next();
                        return ["ok", result];
                    } else {
                        return [code, result];
                    }
                } 
            case "delete": 
                const index = appointments.findIndex((x) => x.id === data.id);
                console.log("index: " + index)
                if(index !== undefined) {
                    appointments.splice(index, 1);
                    externalHandle.next();
                }
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

const Dates = {
    do: (action, data) => {
        switch(action) {
            case "query": 
                return Query.do("dates", data)
            default:
                return ["error", `'${action}' is not a valid date action`]
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
                    default: return ["error", "Unknown appointment query type: " + data.type];
                }
            }
            case "dates": {
                switch(data.type) {
                    case "has-appointments": {
                        return ["ok", apptObservable.pipe(map((appts) => {
                            return Object.keys(R.groupBy(day, appts)).map((dateStr) => {
                                console.log("DATE: " + dateStr);
                                return moment(parseInt(dateStr)).toDate()
                            }) 
                        }))]

                        function day(appt) {
                            return moment(appt.startDate).startOf("day").valueOf().toString();
                        }
                    }
                    default: return ["error", "Unknown date query type: " + data.type ]
                }
            }
            default: {
                return ["error", `'${context}' is not a valid query context`];
            }
        }
    },
}


export const Validate = {
    do: (context, action, data) => {
        console.log("VALIDATING");
        switch(context) {
            case "appointment": {
                switch(action) {
                    case "create": {
                        let result = thread(data, 
                            required('title'), 
                            required('startDate'), 
                            required('begins'),
                            defaultValue('endDate', moment(data.startDate).endOf('day').toDate()),
                            defaultValue('ends', moment(data.begins).toDate()),
                        );
                        return result;
                    }
                    case "update": {
                        console.log("validating update")
                        let result = thread(data,
                            required('title'),
                            required('startDate'),
                            required('begins'),
                            defaultValue('endDate', moment(data.startDate).endOf('day').toDate()),
                            defaultValue('ends', moment(data.begins).toDate()),
                        );

                        return result;
                    }
                    default: 
                        return ["error", `'${action}' does is not validated in the appointment context`];
                }
            } 
            default:
                return ["error", "No validation for context: " + context];
            
        }
    }
}

function thread(initialData, ...args) {
    let f = R.pipe(
        ...args
    );
    return f(["ok", initialData]);
}

function required(field){
    return ([code, data]) => {
        if(code === "error") {
            return [code, data]
        }

        const val = data[field]
        if(val === undefined) {
            return ["error", `Field ${field} does not exist`];
        }

        if(typeof val === "string") {
            return val.length > 0 ? ["ok", data] : ["error", field + " is required"]
        } else if (val instanceof Date) {
            return moment(val).isValid() ? ["ok", data] : ["error", field + " is required"]
        }
    }
}

function defaultValue(field, defaultVal) {
    return ([code, data]) => {
        if(code === "error") {
            return [code, data]
        }

        let d = R.clone(data);
        if(d[field] === undefined || d[field] === "" || !moment(d[field]).isValid()) {
            d[field] = defaultVal;
        }
        return ["ok", d]
    }
}