import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { Tooltip, OverlayTrigger, Popover, ListGroup, ListGroupItem, Table, Well, Grid, ProgressBar, Row, Col, Panel } from 'react-bootstrap';
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

    getMachineAccessibilityIcon(props) {
        console.info("props", props);
        if (!this.isWorkerAlive(props)) {
            return (
            <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${props.machineId}-Accessibility`}>{`"${props.status.worker}`}" has no response</Tooltip>}>
                <span className="glyphicon glyphicon-remove-circle"></span>
            </OverlayTrigger>
            );
        } else if (props.status.lock) {
            return (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${props.machineId}-Accessibility`}>Locked. Click to unlock it</Tooltip>}>
                    <span className="glyphicon glyphicon-ban-circle" onClick={props.onLockMachine.bind(null, props.machineId, false)}></span>
                </OverlayTrigger>
            );
        } else {
            return (
            <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${props.machineId}-Accessibility`}>Available. Click to lock it</Tooltip>}>
                <span className="glyphicon glyphicon-ok-circle" onClick={props.onLockMachine.bind(null, props.machineId, true)}></span>
            </OverlayTrigger>
            );
        }
    }

    getPanelHeader(props) {
        return (
            <table className="headerGroup">
                <tr>
                    <td>
                        <span className="headerLabel">
                            <a href={`http://${props.status.setting.ACP_management_IP}`}>ACP-{props.machineId}</a>
                        </span>
                    </td>
                    <td className="headerCommand">
                        {this.getMachineAccessibilityIcon(props)}
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
        <Popover id={`machineDetails-${props.machineId}`} className="myPopover" title="Machine Details">
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
        if (JSON.stringify(this.props) != JSON.stringify(nextProps)) {
            return true;
        } else {
            return false;
        }
    }

    isInfoValid(props) {
        return Object.keys(props.status).length !== 0 && props.status.status;
    }

    isWorkerAlive(props) {
        return this.isInfoValid(props) && Object.keys(props.status.status).length !== 0;
    }

    render() {
        try {
            //console.info("machine", this.props.machineId, " haveInfo = ", haveInfo);
            return (
                <Panel header={this.getPanelHeader(this.props)} className="machinePanel">
                    {this.isInfoValid(this.props) ?
                        <ListGroup fill>
                            {this.props.status.status.waiting && this.props.status.status.waiting.map(job => {
                                if (this.isConcernedJob(job)) {
                                    return (
                                        <ListGroupItem key={job.ID}>
                                            <MachineJob key={job.ID} state="waiting" info={job} workerUrl={this.props.status.workerUrl}/>
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
                                            <MachineJob key={job[1].ID} state="running" info={job[1]} workerUrl={this.props.status.workerUrl}/>
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
                                            <MachineJob key={job[1].ID} state="finished" info={job[1]} workerUrl={this.props.status.workerUrl}/>
                                        </ListGroupItem>
                                    );
                                } else {
                                    return "";
                                }
                            })}
                        </ListGroup>
                        :
                        <div>
                            Failed to retrieve status.
                        </div>
                    }
                </Panel>
            );
        } catch (e) {
            console.info("Error occurred: ", e.stack);
            return <div>Error occurred: {e.message}</div>
        }
    }
}
