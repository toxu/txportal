import fetch from 'isomorphic-fetch';
import {
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

export function txtRvSelectOne(txtRv) {
	return {
		type: TXT_RV_SELECT_ONE,
		txtRv
	};
}

export function txtRvInvalidate(branch) {
	return {
		type: TXT_RV_INVALIDATE,
		branch
	};
}

export function txtRvReq(branch) {
	return {
		type: TXT_RV_REQ,
		branch
	};
}

export function txtRvRecv(json) {
	return {
		type: TXT_RV_RECV,
		txtRv: json,
		receivedAt: Date.now()
	};
}

export function fetchTxtRv() {
	return dispatch => {
        dispatch(txtRvReq());
		return fetch('/api/couchpotato/txt_results/design/txtbrowser/view/txtbrowser')
		.then(req => req.json())
		.then(json => dispatch(txtRvRecv(json)));
	};
}

export function deleteDocument(document_id, document_rev) {
    console.log("delete docuemnt 1");
    console.log(document_id);
    console.log(document_rev);
    return dispatch => {
        console.log("delete document 2");
        return fetch('/api/couchpotato/txt_results/'+ document_id+ "/" + document_rev)
        .then(req => dispatch(fetchTxtRv()));
    };
}

export function setFilter(filter) {
	return {
		type: TXT_SET_FILTER,
		filter: filter
	};
}

export function setDateInfo(startDate, endDate){
	return {
		type: TXT_SET_DATE,
		startDate: startDate,
		endDate: endDate
	}
}

export function filterByName(name){
	return {
		type: TXT_Filter_BY_NAME,
		filterByName: name
	}
}

export function filterByRSTP(build){
	return {
		type: TXT_Filter_BY_RSTP,
		filterByRSTP: build
	}
}

export function filterByTag(tag){
	return {
		type: TXT_Filter_BY_TAG,
		filterByTag: tag
	}
}

export function filterByRatio(ratio){
	return {
		type: TXT_Filter_BY_RATIO,
		filterByRatio: ratio
	}
}
