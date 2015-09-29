import fetch from 'isomorphic-fetch';

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

export function fetchUtterProjects() {
	return dispatch => {
		dispatch(utterGetProjectsStart());
		return fetch('http://localhost:4000/api/utter/projects')
		.then(req => req.json())
		.then(json => dispatch(utterProjectsRecv(json)));
	}
}
