import { combineReducers } from 'redux';
import {
    TAGS_FETCH,
    TAGS_UPDATETAGS,
    TAGS_SELECT_ALL_SUITE,
    TAGS_SELECT_ONE_SUITE,
    TAGS_SEARCH_TAGS
} from '../constants/action_types';

export default function tags(state = {
    filter: [],
    updateInterval: 600000,
    activeSuite: ['All'],
    isFetching: false,
    tags: {}
}, action) {
    switch (action.type) {
        case TAGS_FETCH:
            return Object.assign({}, state, {
                isFetching: true
            });
        case TAGS_UPDATETAGS:
            return Object.assign({}, state, {
                isFetching: false,
                tags: action.tags
            });
        case TAGS_SELECT_ALL_SUITE:
            return Object.assign({}, state, {
                activeSuite: ['All']
            });
        case TAGS_SELECT_ONE_SUITE:
            var all_index = state.activeSuite.indexOf('All');
            var suite_index = state.activeSuite.indexOf(action.suite);
            if (all_index === -1){
                if (suite_index === -1)
                    return Object.assign({}, state, {
                        activeSuite: state.activeSuite.slice().concat(action.suite)});
                else {
                    if (state.activeSuite.length > 1)
                        return Object.assign({}, state, {
                            activeSuite: state.activeSuite.slice(0, suite_index).concat(state.activeSuite.slice(suite_index+1))});
                    else
                        return Object.assign({}, state, {
                            activeSuite: ['All']
                        });
                    }
            } else {
                if (suite_index === -1)
                    return Object.assign({}, state, {
                        activeSuite: [action.suite]
                    })
            }
        case TAGS_SEARCH_TAGS:
            var query_string = action.pattern;
            var tags = query_string.split(' ');
            tags = tags.filter(
                (tag) => {
                    return tag !== "";
                }
            );
            console.log(tags);
            return Object.assign({}, state, {
                filter: tags
            });
        default:
            return state;
    }
}
