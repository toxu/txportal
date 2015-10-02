import React from 'react';
import {connect} from 'react-redux';
import {utterTabSelected} from '../actions/mainform';

// UI
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Nav from 'react-bootstrap/lib/Nav';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import TxtResultList from "./txt_result_list";
import Utter from "./utter";

// CSS
import '../../css/mainform.css';

class MainForm extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    handleSelect(key) {
        this.props.dispatch(utterTabSelected(key));
    }

    render() {
        var content = <div/>;
        switch(this.props.activePageId) {
        case 1:
            content = <TxtResultList/>;
            break;
        case 2:
            content = <Utter/>;
            break;
        default:
            content = <div/>;
            break;
        }
        return (
                <div>
                <Navbar brand="Tx Portal" activeKey={this.props.activePageId} fixedTop={true} fluid={true}>
                <Nav>
                <NavItem eventKey={1} href="javascript:void(0);" onClick={this.handleSelect.bind(this, 1)}>Test Results</NavItem>
                <NavItem eventKey={2} href="javascript:void(0);" onClick={this.handleSelect.bind(this, 2)}>Utter Results</NavItem>
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
