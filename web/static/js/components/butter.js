import React from 'react';
import {connect} from 'react-redux';
import { fetchButterResults, fetchButterProjects, butterTabSelected } from '../actions/butter';

// UI
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import ButterResultList from './butter_result_list';

class Butter extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch, projsource } = this.props;
        dispatch(fetchButterProjects(projsource));
    }

    handleSelect(key) {
        this.props.dispatch(butterTabSelected(key));
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
                    return <Tab eventKey={key} title={proj}> <ButterResultList rvlist={results[key-1]}/> </Tab>
                }
            }
        );

        key = activeProjectId-1;
        if (projects[key] != undefined
            && (results[key] == undefined || results[key].length == 0)) {
            dispatch(fetchButterResults(key, projects[key]));
        }

        return (
	<div className="butter-result-main">
            <Tabs activeKey={activeProjectId} onSelect={this.handleSelect.bind(this)}>
                {tabs}
            </Tabs>
	</div>
        );
    }
}

function select(state) {
    return state.butter;
}

export default connect(select)(Butter);
