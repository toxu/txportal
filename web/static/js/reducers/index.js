import { combineReducers } from 'redux';
import {
    MF_PAGE_SELECT,

    BUTTER_TAB_SELECT,
    BUTTER_GET_PROJECTS_START,
    BUTTER_PROJECTS_RECV,
    BUTTER_RESULTS_RECV,

    TXT_RV_REQ,
    TXT_RV_RECV,
    TXT_RV_SELECT_ONE,
    TXT_RV_INVALIDATE,
	TXT_WORKER_STATUS_REQ,
	TXT_WORKER_STATUS_RECV,
    TXT_SET_FILTER,
    TXT_SET_DATE,
    TXT_Filter_BY_NAME,
    TXT_Filter_BY_RSTP,
    TXT_Filter_BY_TAG,
    TXT_Filter_BY_RATIO
} from '../constants/action_types';

import scheduler from './scheduler.js';
import tags from './tags.js';

function selectTxtRv(state = '', action) {
	switch(action.type) {
	case TXT_RV_SELECT_ONE:
		return action.txtRv;
	default:
		return state;
	}
}

function txtWorker(state = {
	items: []
}, action) {
	switch(action.type) {
		case TXT_WORKER_STATUS_REQ:
			return Object.assign({}, state, {
				isFetching: true,
			});
		case TXT_WORKER_STATUS_RECV:
			return Object.assign({}, state, {
				isFetching: false,
				items: action.workerStatusRv,
				lastUpdated: action.receivedAt
			});
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
   	filterByTag: [],
   	filterByRatio: "",
    updateInterval: 600000 
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
		if(action.filterByName == state.filterByName)
			var name = "";
		else
			var name = action.filterByName;
		return Object.assign({}, state, {
			filterByName: name
		});
	case TXT_Filter_BY_RSTP:
		if(action.filterByRSTP.indexOf('TXP-') != -1 || action.filterByRSTP == state.filterByRSTP)
			var rstp = "";
		else
			var rstp = action.filterByRSTP;
		return Object.assign({}, state,{
			filterByRSTP: rstp
		});
	case TXT_Filter_BY_TAG:
        var index = state.filterByTag.indexOf(action.filterByTag);
		if(index != -1){
            return Object.assign({}, state, {filterByTag: state.filterByTag.slice(0,index).concat(state.filterByTag.slice(index+1))});
        }
		else{
            return Object.assign({}, state, {filterByTag: state.filterByTag.slice().concat(action.filterByTag)});
        }
	case TXT_Filter_BY_RATIO:
		return Object.assign({}, state,{
			filterByRatio: action.filterByRatio
		});
	default:
		return state;
	}
}

function butter(state = {
    projects: [],
    results: [],
    activeProjectId: 1,
    projsource: '/api/butter/projects'
}, action) {
	switch(action.type) {
	case BUTTER_TAB_SELECT:
		  return Object.assign({}, state, {
			    activeProjectId: action.activeProjectId
		  });
	case BUTTER_GET_PROJECTS_START:
		return state; // now we dont do any fetching indication, just by-pass the get action
	case BUTTER_PROJECTS_RECV:
		return Object.assign({}, state, {
			  projects: action.rv,
        results: []
		});
	case BUTTER_RESULTS_RECV:
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
    activePageId: defaultActivePageId // defined at page_controller.ex
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
    butter,
	txtWorker,
	scheduler,
    tags
});

export default rootReducer;
