import React from 'react';
import {connect} from 'react-redux';
import { fetchUtterResults, fetchUtterProjects, utterTabSelected } from '../actions/utter';

// UI
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import UtterResultList from './utter_result_list';

class Utter extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch, projsource } = this.props;
        dispatch(fetchUtterProjects(projsource));
    }

    handleSelect(key) {
        this.props.dispatch(utterTabSelected(key));
    }

    render() {
        const { dispatch, projects, results, activeProjectId } = this.props;

        var key = 0;
        var tabs = projects.map(
            (proj) => {
                key++;
                if (results[key-1] == undefined) {
                    return <Tab eventKey={key} title={proj}></Tab>
                }
                else {
                    return <Tab eventKey={key} title={proj}> <UtterResultList rvlist={results[key-1]}/> </Tab>
                }
            }
        );

        key = activeProjectId-1;
        if (projects[key] != undefined
            && (results[key] == undefined || results[key].length == 0)) {
            dispatch(fetchUtterResults(key, projects[key]));
        }

        return (
            <Tabs activeKey={activeProjectId} onSelect={this.handleSelect.bind(this)}>
                {tabs}
            </Tabs>
        );
    }
}

function select(state) {
    return state.utter;
}

export default connect(select)(Utter);
