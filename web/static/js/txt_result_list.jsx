var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

class TxtResultList extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			action: props.action,
			results: []
		};
	}
	
	componentDidMount() {
		$.get(this.props.source, function(result) {
			this.setState({
				action: 'Results loaded.',
				results: result
			});
		}.bind(this));
	}

	render() {
		var result_items = this.state.results.map(
				(result) => {
					return <ListGroupItem>{result.id} ==> {result.rv}</ListGroupItem>
				}
				)
		return (
				<div className='myclass'>
				<div>{this.state.action}</div>
				<ListGroup>
				{result_items}
				</ListGroup>
				</div>
		       )
	}
}

TxtResultList.defaultProps = {action: 'Loading...', source: 'http://localhost:4000/api/txtresults'};
export default TxtResultList
