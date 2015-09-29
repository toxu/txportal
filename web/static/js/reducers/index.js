import { combineReducers } from 'redux';
import {
	TXT_RV_REQ,
	TXT_RV_RECV,
	TXT_RV_SELECT_ONE,
	TXT_RV_INVALIDATE,
} from '../actions/txt_results';

import {
	UTTER_GET_PROJECTS_START,
	UTTER_PROJECTS_RECV
} from '../actions/utter';

function selectTxtRv(state = '', action) {
	switch(action.type) {
	case TXT_RV_SELECT_ONE:
		return action.txtRv;
	default:
		return state;
	}
}

function loadTxtRv(state = {
	isFetching: false,
	didInvalidate: false,
	items: []
}, action) {
	switch(action.type) {
	case TXT_RV_INVALIDATE:
		return Object.assign({}, state, {
			didInvalidate: true
		});
	case TXT_RV_REQ:
		return Object.assign({}, state, {
			isFetching: true,
			didInvalidate: false 
		});
	case TXT_RV_RECV:
		return Object.assign({}, state, {
			isFetching: false, 
			didInvalidate: false,
			items: action.txtRv,
			lastUpdated: action.receivedAt
		});
	default:
		return state;
	}
}

function utter(state = {
	projects: [],
	projsource: 'http://localhost:4000/api/utter/projects',
}, action) {
	switch(action.type) {
	case UTTER_GET_PROJECTS_START:
		return state; // now we dont do any fetching indication, just by-pass the get action
	case UTTER_PROJECTS_RECV:
		return Object.assign({}, state, {
			projects: action.rv
		});
	default:
		return state;
	}
}

const rootReducer = combineReducers({
	loadTxtRv,
	selectTxtRv,
	utter
});

export default rootReducer;
