import { combineReducers } from 'redux';
import {
    SCHEDULER_FETCH,
    SCHEDULER_UPDATESTATUS,
    SCHEDULER_CONNECTIONLOST,
    SCHEDULER_SHOW_CREATE_JOB_MODAL
} from '../constants/action_types';

var sampleMachineSettings = {
    208: {
        setting: {
            "ACP_management_IP": "172.31.1.207",
            "streamer": "10.51.100.61",
            supported_test_types: ["TS","StatMux"]
        },
        worker: "ChrisPC",
        workerUrl: "http://10.21.133.28:12345/",
        lock: false,
        lockMessage: "",
        status: {
            running: [
                ["208", {
                    "report_receivers": "trans",
                    "testSuiteName": "TS",
                    "acpName": "208",
                    "acpBuild": "1.2.0.0.255",
                    "installed_artifacts": {
                        "TxMould": {
                            "project": "TxMould",
                            "build": "2.4.0.0-eng.1144",
                            "branch": "trunk",
                            "installed": "Mon Sep 21 18:05:48 2015"
                        }
                    },
                    "ID": 71707,
                    "txtBuild": "newTXT",
                    "txtBuildUrl": "\\\\10.50.100.188\\Users\\ctsang\\Documents\\projects\\ACP_StandaloneTxTest-trunk\\ACP_StandaloneTxTest\\txt\\output\\results\\20151008-123703",
                    "startTime": 1444479026.724,
                    "timestamp": "20151008-123703",
                    "progress": "100/124",
                    "transcodePackBuild": "1.15.0.0.181",
                    "testSuiteNumOfCase": 124,
                    "ACP_management_IP": "172.31.1.208"
                }],
                ["208", {
                    "timestamp": "20151013-200531",
                    "upgrade": "1.2.x.0",
                    "ID": 40011,
                    "progress": [
                        "ls / ",
                        "..."
                    ]
                }]
            ],
            waiting: [
                {
                    "subset": ["BC_AC3"],
                    "retry": "",
                    "tag": ["HEVC"],
                    "publish": false,
                    "priority": 2,
                    "job": "run_test",
                    "setting": "208",
                    "user": "Edmond",
                    "interrupt": false,
                    "suite": "TS",
                    "ID": 75541,
                    "repeat": ""
                },
                {
                    "priority": 2,
                    "job": "upgrade",
                    "setting": "208",
                    "build": "1.2.x.0",
                    "interrupt": false,
                    "ID": 31913,
                    "user": "Edmond"
                }
            ],
            finished:[
                ["208", {
                    timestamp: "20151007-123738",
                    finished: "2015-10-07 12:40:41",
                    upgrade: "1.2.0.0.251",
                    ID: 82898,
                    result: "success"
                }],
                ["208", {
                    "timestamp": "20151008-010238",
                    "finished": "2015-10-08 01:05:16",
                    "ID": 39391,
                    "clean": 100,
                    "result": "success"
                }],
                ["208", {
                    "publish": true,
                    "report_receivers": "trans",
                    "testSuiteName": "TS",
                    "startTime": 1444258673.61,
                    "timestamp": "20151008-065751",
                    "acpBuild": "1.2.0.0.252",
                    "installed_artifacts": {
                        "TxMould": {
                            "project": "TxMould",
                            "build": "2.4.0.0-eng.1144",
                            "branch": "trunk",
                            "installed": "Mon Sep 21 18:05:48 2015"
                        }
                    },
                    "ID": 9860,
                    "txtBuild": "newTXT",
                    "txtBuildUrl": "\\\\10.50.100.188\\Users\\ctsang\\Documents\\projects\\ACP_StandaloneTxTest-trunk\\ACP_StandaloneTxTest\\txt\\output\\results\\20151008-065751",
                    "finished": "2015-10-08 11:47:53",
                    "totalTests": 123,
                    "acpName": "208",
                    "numSuccs": 91,
                    "endTime": 1444276073.517,
                    "transcodePackBuild": "1.15.0.0.180",
                    "testSuiteNumOfCase": 124,
                    "ACP_management_IP": "172.31.1.208"
                    }
                ],
            ]
        }
    }
};


// TODO change the initial SETTING!!!!!
export default function scheduler(state = {
    createJobModal: {isVisible: false, machineId: "unknown"},
    isFetching: false,
    connectionLost: false,
    updateInterval: 2000,
    machines: {}
}, action) {
    switch (action.type) {
        case SCHEDULER_SHOW_CREATE_JOB_MODAL:
            console.info("create job", action.machineId);
            return Object.assign({}, state, {
                createJobModal: {
                    isVisible: action.show,
                    machineId: action.machineId
                }
            });
        case SCHEDULER_FETCH:
            return Object.assign({}, state, {
                isFetching: true
            });
        case SCHEDULER_UPDATESTATUS:
            const { machines } = action;
            return Object.assign({}, state, {
                connectionLost: false,
                isFetching: false,
                machines: machines
            });
        case SCHEDULER_CONNECTIONLOST:
            return Object.assign({}, state, {
                connectionLost: true,
                isFetching: false
            });
        default:
            return state;
    }
}
