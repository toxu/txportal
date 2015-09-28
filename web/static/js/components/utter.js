import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

var $ = require("jquery")

class Utter extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			key: 2,
			projects: []
		};
	}
	
	componentDidMount() {
		console.log(this.props.projsource);
		this.loadProjects(this);
		//setInterval(this.updateResults, 5000, this);
	}

	loadProjects(me) {
		$.get(me.props.projsource, function(r) {
			me.setState({
				projects: r
			});
		}.bind(me));
	}

	updateResults(me) {
		console.log("Utter updating result...");
		console.log(me.props);
		$.get(me.props.source, function(r) {
			me.setState({
				results: r
			});
		}.bind(me));
	}

	render() {
		console.log("Rendering utter");
		console.log(this.state.projects);

		var ek = 0;
		var tabs = this.state.projects.map(
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

Utter.defaultProps = {action: 'Loading...', projsource: 'http://localhost:4000/api/utter/projects'};
export default Utter
