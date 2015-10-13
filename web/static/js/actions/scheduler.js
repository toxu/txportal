import {
    SCHEDULER_FETCH,
    SCHEDULER_UPDATESTATUS,
    SCHEDULER_CONNECTIONLOST
} from '../constants/action_types';
import fetch from 'isomorphic-fetch';

var schedulerUrl = "http://10.50.104.13:23456";
//var schedulerUrl = "/api/scheduler";

function fetchNow() {
     return {
         type: SCHEDULER_FETCH
     };
}

function lostConnection(msg) {
    return {
        type: SCHEDULER_CONNECTIONLOST
    };
}

function updateMachineStatus(json) {
    return {
        type: SCHEDULER_UPDATESTATUS,
        receiveAt: Date.now(),
        machines: json
    }
}

// TODO not to do cross domain fetch here
export function fetchStatus() {
    return dispatch => {
        dispatch(fetchNow());
        return fetch(schedulerUrl + "/status", {method: "POST", body: ""})
        // TODO handle exception !!!!!!!!!!!!!!!!!!!!!! Dispatch error message
        .then(response => response.json())
        .then(json => dispatch(updateMachineStatus(json)));
        //.catch(result => dispatch(lostConnection(result)));
    };
}