import React from 'react';
import {connect} from 'react-redux';
import {mainformTabSelected} from '../actions/mainform';

// UI
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Nav from 'react-bootstrap/lib/Nav';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import TxtResultList from "./txt_result_list";
import Butter from "./butter";
import Worker from './worker';
import Scheduler from "./scheduler/scheduler.js";
import Tags from "./tags/tags";

// CSS
import '../../css/mainform.css';

class MainForm extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    handleSelect(key) {
        this.props.dispatch(mainformTabSelected(key));
    }

    render() {
        var content = <div/>;
        switch(this.props.activePageId) {
        case 1:
            content = <TxtResultList/>;
            break;
        case 2:
            content = <Butter/>;
            break;
        case 3:
            content = <Scheduler/>;
            break;
        case 4:
            content = <Tags/>;
            break;
        default:
            content = <div/>;
            break;
        }
        return (
                <div>
                <Navbar brand=<div style={{padding: "0px"}}><img src="images/logo-s.png" style={{maxHeight:"50px", padding:"7px", display: "inline-block"}} /> TxPortal </div> activeKey={this.props.activePageId} fixedTop={true} fluid={true}>
                <Nav>
		<NavDropdown eventKey={1} title="TXT" id="txt-dropdown">
                    <MenuItem eventKey="1.1" href="javascript:void(0);" onSelect={this.handleSelect.bind(this, 1)}>Results</MenuItem>
                    <MenuItem eventKey="1.2">Statistics</MenuItem>
                    <MenuItem eventKey="1.3" href="javascript:void(0);" onSelect={this.handleSelect.bind(this, 3)}>Scheduler</MenuItem>
                    <MenuItem eventKey="1.4" href="javascript:void(0);" onSelect={this.handleSelect.bind(this, 4)}>Coverage</MenuItem>
		</NavDropdown>
		<NavDropdown eventKey={2} title="Butter" id="butter-dropdown">
                    <MenuItem eventKey="2.1" href="javascript:void(0);" onSelect={this.handleSelect.bind(this, 2)}>Results</MenuItem>
                    <MenuItem eventKey="2.2">Workers</MenuItem>
		</NavDropdown>
                </Nav>
                </Navbar>
                <div className='portal-content'> {content} </div>
                </div>
        )
    }
}

function select(state) {
    return state.mainform;
}

export default connect(select)(MainForm);
