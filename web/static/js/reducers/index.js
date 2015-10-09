import { combineReducers } from 'redux';
import {
    MF_PAGE_SELECT,

    UTTER_TAB_SELECT,
    UTTER_GET_PROJECTS_START,
    UTTER_PROJECTS_RECV,
    UTTER_RESULTS_RECV,

    TXT_RV_REQ,
    TXT_RV_RECV,
    TXT_RV_SELECT_ONE,
    TXT_RV_INVALIDATE,
    TXT_SELECTED_TEST,
    TXT_CANCEL_SELECTED_TEST
} from '../constants/action_types';

import scheduler from './scheduler.js';

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
    items: [],
    selected: []
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
	case TXT_SELECTED_TEST:
		return Object.assign({}, state, {
			selected: [...state.selected, action.selected]
		});
	case TXT_CANCEL_SELECTED_TEST:
		return Object.assign({}, state, {
			//selected: [state.selected.splice(state.selected.indexOf(action.unselected),1)]
			selected: [...state.selected.slice(0, action.index), ...state.selected.slice(action.index+1)]
		});
	default:
		return state;
	}
}

function utter(state = {
    projects: [],
    results: [],
    activeProjectId: 1,
    projsource: '/api/utter/projects'
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
			  projects: action.rv,
        results: []
		});
	case UTTER_RESULTS_RECV:
		  return Object.assign({}, state, {
			    results: [...(state.results).slice(0, action.index),
                    Object.assign([], state.results[action.index], action.rv),
                    ...(state.results).slice(action.index + 1)
                    ]
		  });
	default:
		return state;
	}
}

function mainform(state = {
    activePageId: 4
}, action) {
    switch (action.type) {
    case MF_PAGE_SELECT:
		    return Object.assign({}, state, {
			      activePageId: action.activePageId
		    });
    default:
        return state;
    }
}


const rootReducer = combineReducers({
    mainform,
    loadTxtRv,
    selectTxtRv,
    utter,
	scheduler
});

export default rootReducer;
