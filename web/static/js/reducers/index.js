import { combineReducers } from 'redux';
import {
    UTTER_TAB_SELECT,
    UTTER_GET_PROJECTS_START,
    UTTER_PROJECTS_RECV,
    UTTER_RESULTS_RECV,

    TXT_RV_REQ,
    TXT_RV_RECV,
    TXT_RV_SELECT_ONE,
    TXT_RV_INVALIDATE,
} from '../constants/action_types';

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
    results: [],
    activeProjectId: 1,
    projsource: 'http://localhost:4000/api/utter/projects'
}, action) {
	switch(action.type) {
	case UTTER_TAB_SELECT:
		  return Object.assign({}, state, {
			    activeProjectId: action.activeProjectId
		  });
	case UTTER_GET_PROJECTS_START:
		return state; // now we dont do any fetching indication, just by-pass the get action
	case UTTER_PROJECTS_RECV:
		return Object.assign({}, state, {
			projects: action.rv
		});
	case UTTER_RESULTS_RECV:
		  return Object.assign({}, state, {
			    results: [...(state.results).slice(0, action.index),
                    Object.assign({}, state.results[action.index], json),
                    ...(state.results).slice(action.index + 1)
                    ]
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
