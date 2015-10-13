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
    TXT_SET_FILTER,
    TXT_SET_DATE,
    TXT_Filter_BY_NAME,
    TXT_Filter_BY_RSTP,
    TXT_Filter_BY_TAG,
    TXT_Filter_BY_RATIO
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
    items: [],
   	filter: "",
   	startDate: "",
   	endDate: "",
   	filterByName: "",
   	filterByRSTP: "",
   	filterByTag: "",
   	filterByRatio: ""
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
	case TXT_SET_FILTER:
		return Object.assign({}, state, {
			filter: action.filter
		});
	case TXT_SET_DATE:
		return Object.assign({}, state, {
			startDate: action.startDate,
			endDate: action.endDate
		});
	case TXT_Filter_BY_NAME:
		if(action.filterByName == 'IP-')
			var name = "";
		else
			var name = action.filterByName;
		return Object.assign({}, state, {
			filterByName: name
		});
	case TXT_Filter_BY_RSTP:
		if(action.filterByRSTP == 'TXP-')
			var rstp = "";
		else
			var rstp = action.filterByRSTP;
		return Object.assign({}, state,{
			filterByRSTP: rstp
		});
	case TXT_Filter_BY_TAG:
		if(state.filterByTag == action.filterByTag)
			var tag = "";
		else
			var tag = action.filterByTag;
		return Object.assign({}, state,{
			filterByTag: tag
		});
	case TXT_Filter_BY_RATIO:
		return Object.assign({}, state,{
			filterByRatio: action.filterByRatio
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
    activePageId: 1
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
    utter
});

export default rootReducer;
