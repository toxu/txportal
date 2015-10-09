import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { OverlayTrigger, Popover, ListGroup, ListGroupItem, Table, Well, Grid, ProgressBar, Row, Col, Panel } from 'react-bootstrap';
import MachineJob from './machineJob.js';
import '../../../css/common.css';

export default class Machine extends Component{

    makeProp(name, value) {
        return (
        <tr>
            <td><strong>{name}:</strong> </td>
            <td>{value}</td>
        </tr>
        );
    }

    getPanelHeader(props) {
        return (
            <table style={{width: "100%"}}>
                <tr>
                    <td>
                        <span style={{fontSize: "small"}}>ACP-{props.machineId}</span>
                    </td>
                    <td style={{textAlign: "right"}}>
                        <OverlayTrigger trigger={["hover", "click"]} rootClose delayHide={1000} placement="bottom" overlay={this.getInfoPopover(props)}>
                            <span className="glyphicon glyphicon-info-sign"></span>
                        </OverlayTrigger>
                    </td>
                </tr>
            </table>
        );
    }

    getInfoPopover(props) {
        return (
        <Popover id={props.machineId} title="Machine Details">
            <table className="propTable">
                <tbody>
                {this.makeProp("Worker", <a href={props.status.workerUrl}>{props.status.worker}</a>)}
                {this.makeProp("Streamer", <a href={"http://" + props.status.setting.streamer + ":1234"}>{props.status.setting.streamer}</a>)}
                {this.makeProp("Supported Tests", props.status.setting.supported_test_types.join(", "))}
                </tbody>
            </table>
        </Popover>
        );
    }

    render() {
        let haveInfo = Object.keys(this.props.status).length !== 0;
        return (
            <Panel collapsible defaultExpanded header={this.getPanelHeader(this.props)} style={{minWidth: '500', width: '48%', display: 'inline-block', margin: '1%'}}>
                {!haveInfo &&
                <div>
                    Failed to retrieve status.
                </div>
                }
                {haveInfo &&
                <ListGroup fill>
                    {this.props.status.status.waiting.map(job => {
                        return (
                            <ListGroupItem key={job.ID}>
                                <MachineJob key={job.ID} state="waiting" info={job}/>
                            </ListGroupItem>
                        );
                    })}
                    {this.props.status.status.running.map(job => {
                        return (
                            <ListGroupItem key={job[1].ID} bsStyle="info">
                                <MachineJob key={job[1].ID} state="running" info={job[1]}/>
                            </ListGroupItem>
                        );
                    })}
                    {this.props.status.status.finished.map(job => {
                        return (
                            <ListGroupItem key={job[1].ID} bsStyle="success">
                                <MachineJob key={job[1].ID} state="finished" info={job[1]}/>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
                }
            </Panel>
        );
    }
}
