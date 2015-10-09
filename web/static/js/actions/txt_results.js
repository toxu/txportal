import fetch from 'isomorphic-fetch';
import {
    TXT_RV_REQ,
    TXT_RV_RECV,
    TXT_RV_SELECT_ONE,
    TXT_RV_INVALIDATE,
    TXT_SELECTED_TEST,
	TXT_WORKER_STATUS_RECV,
    TXT_CANCEL_SELECTED_TEST
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
		return fetch('/api/couchpotato/txt_results/design/txtbrowser/view/txtbrowser')
		.then(req => req.json())
		.then(json => dispatch(txtRvRecv(json)));
	};
}

export function recvWorkerStatus(json) {
	return {
		type: TXT_WORKER_STATUS_RECV,
		workerStatusRv: json,
		receivedAt: Date.now()
	};
}

export function fetchWorkerStatus() {
	return dispatch => {
		return fetch('/api/txt/status')
		.then(req => req.json())
		.then(json => dispatch(recvWorkerStatus(json)));
	};
}

export function selectedTest(testName) {
	return {
		type: TXT_SELECTED_TEST,
		selected : testName
	};
}

export function cancelSelectedTest(index) {
	return {
		type: TXT_CANCEL_SELECTED_TEST,
		index : index
	};
}
