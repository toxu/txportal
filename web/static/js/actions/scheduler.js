import {
    SCHEDULER_FETCH,
    SCHEDULER_UPDATESTATUS,
    SCHEDULER_CONNECTIONLOST,
    SCHEDULER_SHOW_CREATE_JOB_MODAL,
    SCHEDULER_UPDATETAGS
} from '../constants/action_types';
import fetch from 'isomorphic-fetch';

//var schedulerUrl = "http://10.50.100.127:23456";
var schedulerUrl = "/api/scheduler";

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
    };
}

export function fetchStatus() {
    return dispatch => {
        dispatch(fetchNow());
        return fetch(schedulerUrl + "/status", {method: "POST", body: ""})
        .then(response => response.json())
        .then(json => dispatch(updateMachineStatus(json)))
        .catch(result => dispatch(lostConnection(result)));
    };
}

export function restartScheduler() {
    return dispatch => {
        fetch(schedulerUrl + "/restart_request", {method: "POST", body: ""})
        .then(response => dispatch(fetchStatus));
    }
}

export function lockMachine(machineId, lock, lockMessage) {
    return dispatch => {
        return fetch(schedulerUrl + "/lockMachine", {method: "POST", body: JSON.stringify({setting: machineId, lock: lock, lockMessage: lockMessage})})
        .catch(result => console.info("lockMachine failed: ", result));
    };
}

export function createJob(param) {
    return dispatch => {
        return fetch(schedulerUrl + "/submit_job", {method: "POST", body: JSON.stringify(param)})
        .catch(result => console.info("createJob failed: ", result));
    }

}

export function showCreateJobModal(machineId, show) {
    return {
        type: SCHEDULER_SHOW_CREATE_JOB_MODAL,
        machineId: machineId,
        show: show
    }
}

export function killJob(machineId, jobId) {
    return dispatch => {
        return fetch(schedulerUrl + "/kill_job", {method: "POST", body: JSON.stringify({setting: machineId, ID: jobId})})
            .catch(result => console.info("kill job failed: ", result));
    }
}
