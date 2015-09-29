import React from 'react';
import {connect} from 'react-redux';
import { fetchUtterProjects, utterTabSelected } from '../actions/utter';

// UI
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

class Utter extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("Utter mounting...");
        const { dispatch, projsource } = this.props;
        dispatch(fetchUtterProjects(projsource));
    }

    handleSelect(key) {
        this.props.dispatch(utterTabSelected(key));
    }

    render() {
        console.log("Rendering utter");
        const { projects, activeProjectId } = this.props;

        var ek = 0;
        var tabs = projects.map(
            (proj) => {
                ek++;
                return <Tab eventKey={ek} title={proj}> {proj} unit test result content </Tab>
            }
        )
        return (
            <Tabs activeKey={activeProjectId} onSelect={this.handleSelect.bind(this)}>
                {tabs}
            </Tabs>
        )
    }
}

function select(state) {
    return state.utter;
}

export default connect(select)(Utter);
