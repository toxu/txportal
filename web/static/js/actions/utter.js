import fetch from 'isomorphic-fetch';
// Project tab selection
export const UTTER_TAB_SELECT = 'UTTER_TAB_SELECT';
export function utterTabSelected(id) {
	return {
		type: UTTER_TAB_SELECT,
		activeProjectId: id
	};
}

// Fetching projects
export const UTTER_GET_PROJECTS_START = 'UTTER_GET_PROJECTS_START';
export const UTTER_PROJECTS_RECV = 'UTTER_PROJECTS_RECV';

export function utterGetProjectsStart() {
	return {
		type: UTTER_GET_PROJECTS_START,
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
export const UTTER_RESULTS_RECV = 'UTTER_RESULTS_RECV';

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
		    return fetch('http://localhost:4000/api/utter/projects/{project}')
		        .then(req => req.json())
		        .then(json => dispatch(utterResultsRecv(index, json)));
	  };
}
