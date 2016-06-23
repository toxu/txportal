import {
    TAGS_FETCH,
    TAGS_UPDATETAGS,
    TAGS_SELECT_ALL_SUITE,
    TAGS_SELECT_ONE_SUITE,
    TAGS_SEARCH_TAGS
} from '../constants/action_types';
import fetch from 'isomorphic-fetch';

var schedulerUrl = "/api/scheduler";

function updateTags(json) {
    return {
        type: TAGS_UPDATETAGS,
        tags: json
    }
}

function fetchingTags() {
    return {
        type: TAGS_FETCH
    }
}

export function selectAllSuite() {
    return {
        type: TAGS_SELECT_ALL_SUITE
    }
}

export function selectOneSuite(suite) {
    return {
        type: TAGS_SELECT_ONE_SUITE,
        suite: suite
    }
}

export function getTags() {
    return dispatch => {
        dispatch(fetchingTags());
        fetch(schedulerUrl + "/get_tags", {method: "POST", body: ""})
        .then(response => response.json())
        .then(json => dispatch(updateTags(json)));
    }
}

export function searchTags(query_string) {
    return {
        type: TAGS_SEARCH_TAGS,
        pattern: query_string
    }
}
