import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { OverlayTrigger, Popover, ListGroup, ListGroupItem, Table, Well, Grid, ProgressBar, Row, Col, Panel } from 'react-bootstrap';
import MachineJob from './machineJob.js';
import '../../../css/common.css';

let nFinishedToShow = 3;

export default class Machine extends Component{

    makeProp(name, value) {
        return (
        <tr>
            <td><strong>{name}:</strong> </td>
            <td>{value}</td>
        </tr>
        );
    }

    isConcernedJob(info) {
        if(info.clean) {
            return false;
        } else {
            return true;
        }
    }

    getPanelHeader(props) {
        return (
            <table className="headerGroup">
                <tr>
                    <td>
                        <span className="headerLabel">ACP-{props.machineId}</span>
                    </td>
                    <td className="headerCommand">
                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.getInfoPopover(props)}>
                            <span className="glyphicon glyphicon-info-sign"></span>
                        </OverlayTrigger>
                    </td>
                </tr>
            </table>
        );
    }

    getInfoPopover(props) {
        return (
        <Popover id={props.machineId} className="myPopover" title="Machine Details">
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

    shouldComponentUpdate(nextProps, nextState) {
        // to accelerate things
        if (this.props.value != nextProps.value) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let haveInfo = Object.keys(this.props.status).length !== 0;
        return (
            <Panel header={this.getPanelHeader(this.props)} className="machinePanel">
                {!haveInfo &&
                <div>
                    Failed to retrieve status.
                </div>
                }
                {haveInfo &&
                <ListGroup fill>
                    {this.props.status.status.waiting && this.props.status.status.waiting.map(job => {
                        if (this.isConcernedJob(job)) {
                            return (
                                <ListGroupItem key={job.ID}>
                                    <MachineJob key={job.ID} state="waiting" info={job}/>
                                </ListGroupItem>
                            );
                        } else {
                            return "";
                        }
                    })}
                    {this.props.status.status.running && this.props.status.status.running.map(job => {
                        if (this.isConcernedJob(job[1])) {
                            return (
                                <ListGroupItem key={job[1].ID} bsStyle="info">
                                    <MachineJob key={job[1].ID} state="running" info={job[1]}/>
                                </ListGroupItem>
                            );
                        } else {
                            return "";
                        }

                    })}
                    {this.props.status.status.finished && this.props.status.status.finished.map((job, i) => {
                        if (this.isConcernedJob(job[1]) && i < nFinishedToShow) {
                            return (
                                <ListGroupItem key={job[1].ID} bsStyle="success">
                                    <MachineJob key={job[1].ID} state="finished" info={job[1]}/>
                                </ListGroupItem>
                            );
                        } else {
                            return "";
                        }
                    })}
                </ListGroup>
                }
            </Panel>
        );
    }
}
