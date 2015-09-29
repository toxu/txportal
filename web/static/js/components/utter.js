import React from 'react';
import {connect} from 'react-redux';
import { fetchUtterProjects } from '../actions/utter';

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
		console.log(this.props);

		dispatch(fetchUtterProjects());
	}

	render() {
		console.log("Rendering utter");
		const { dispatch, projects, projsource } = this.props;

		var ek = 0;
		var tabs = projects.map(
				(proj) => {
					ek++;
					return <Tab eventKey={ek} title={proj}>{proj} unit test result content</Tab>
				}
				)
		return (
				<Tabs defaultActiveKey={1}>
				{tabs}
				</Tabs>
		       )
	}
}

function select(state) {
    return state.utter;
}

export default connect(select)(Utter);
