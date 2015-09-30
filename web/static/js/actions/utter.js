import fetch from 'isomorphic-fetch';
import {
    UTTER_TAB_SELECT,
    UTTER_GET_PROJECTS_START,
    UTTER_PROJECTS_RECV,
    UTTER_RESULTS_RECV
} from '../constants/action_types';

// Project tab selection
export function utterTabSelected(id) {
	return {
		type: UTTER_TAB_SELECT,
		activeProjectId: id
	};
}

// Fetching projects
export function utterGetProjectsStart() {
	return {
		type: UTTER_GET_PROJECTS_START
	};
}

export function utterProjectsRecv(json) {
	return {
		type: UTTER_PROJECTS_RECV,
		rv: json,
		receivedAt: Date.now()
	};
}

export function fetchUtterProjects(url) {
	return dispatch => {
		dispatch(utterGetProjectsStart());
		return fetch(url)
		.then(req => req.json())
		.then(json => dispatch(utterProjectsRecv(json)));
	}
}

// Fetching test results per project
export function utterResultsRecv(index, json) {
	  return {
		    type: UTTER_RESULTS_RECV,
        index: index,
		    rv: json,
		    receivedAt: Date.now()
	  };
}
export function fetchUtterResults(index, project) {
	  return dispatch => {
		    return fetch('/api/utter/projects/{project}')
		        .then(req => req.json())
		        .then(json => dispatch(utterResultsRecv(index, json)));
	  };
}
