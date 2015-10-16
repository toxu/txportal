import fetch from 'isomorphic-fetch';
import {
    BUTTER_TAB_SELECT,
    BUTTER_GET_PROJECTS_START,
    BUTTER_PROJECTS_RECV,
    BUTTER_RESULTS_RECV
} from '../constants/action_types';

// Project tab selection
export function butterTabSelected(id) {
	return {
		type: BUTTER_TAB_SELECT,
		activeProjectId: id
	};
}

// Fetching projects
export function butterGetProjectsStart() {
	return {
		type: BUTTER_GET_PROJECTS_START
	};
}

export function butterProjectsRecv(json) {
	return {
		type: BUTTER_PROJECTS_RECV,
		rv: json,
		receivedAt: Date.now()
	};
}

export function fetchButterProjects(url) {
	return dispatch => {
		dispatch(butterGetProjectsStart());
		return fetch(url)
		.then(req => req.json())
		.then(json => dispatch(butterProjectsRecv(json)));
	}
}

// Fetching test results per project
export function butterResultsRecv(index, json) {
	  return {
		    type: BUTTER_RESULTS_RECV,
        index: index,
		    rv: json,
		    receivedAt: Date.now()
	  };
}
export function fetchButterResults(index, project) {
	  return dispatch => {
		    return fetch('/api/butter/projects/' + project)
		        .then(req => req.json())
		        .then(json => dispatch(butterResultsRecv(index, json)));
	  };
}
