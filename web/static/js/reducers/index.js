import { combineReducers } from 'redux';
import {
	TXT_RV_REQ,
	TXT_RV_RECV,
	TXT_RV_SELECT_ONE,
	TXT_RV_INVALIDATE
} from '../actions/index';

function selectTxtRv(state = '', action) {
	switch(action.type) {
	case TXT_RV_SELECT_ONE:
		return action.txtRv;
	default:
		return state;
	}
}

function reqTxtRv(state = {
	isFetching = false,
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


const rootReducer = combineReducers({
	reqTxtRv,
	selectTxtRv
});

export default rootReducer;
