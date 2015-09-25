//var Navbar = ReactBootstrap.Navbar;
//var NavItem = ReactBootstrap.NavItem;
//var NavDropdown = ReactBootstrap.NavDropdown;
//var Nav = ReactBootstrap.Nav;
//var MenuItem = ReactBootstrap.MenuItem;

//import React from 'react'
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Nav from 'react-bootstrap/lib/Nav';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import TxtResultList from "./txt_result_list"
import Utter from "./utter"

class MainForm extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			page: "Empty"
		};
	}
	
	componentDidMount() {
	}

	handleClick(str) {
		console.log("Loading " + str);
		this.setState({
			page: str
		});
	}

	render() {
		var content = <div/>;
		switch(this.state.page) {
			case 'TxtResultList':
				content = <TxtResultList/>;
				break;
			case 'Utter':
				content = <Utter/>;
				break;
			default:
				content = <div/>;
				break;
		}
		return (
				<div>
				<Navbar brand="Tx Portal">
				<Nav>
				<NavItem eventKey={1} href="javascript:void(0);" onClick={this.handleClick.bind(this, "TxtResultList")}>Test Results</NavItem>
				<NavItem eventKey={2} href="javascript:void(0);" onClick={this.handleClick.bind(this, "Utter")}>Utter Results</NavItem>
				<NavDropdown eventKey={3} title="More" id="basic-nav-dropdown">
				<MenuItem eventKey="1">Action</MenuItem>
				<MenuItem eventKey="2">Another action</MenuItem>
				<MenuItem eventKey="3">Something else here</MenuItem>
				<MenuItem divider />
				<MenuItem eventKey="4">Separated link</MenuItem>
				</NavDropdown>
				</Nav>
				</Navbar>
				<div className='portal-content'>
				{content}
				</div>
				</div>
		       )
	}
}

export default MainForm
