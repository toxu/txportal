import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { Button, Input, Glyphicon, Tooltip, OverlayTrigger, Popover, ListGroup, ListGroupItem, Table, Well, Grid, ProgressBar, Row, Col, Panel } from 'react-bootstrap';
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

    isConcernedJob(info, state) {
        if(info.clean && state !== "running") {
            return false;
        } else {
            return true;
        }
    }

    getSubmitJobIcon(props) {
        if (this.isWorkerAlive(props) && !props.status.lock) {
            return (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${props.machineId}-CreateNewJob`}>Create a new job</Tooltip>}>
                    <span className="machineActionIcon glyphicon glyphicon-play-circle" onClick={() => props.showCreateJobModal(props.machineId, true)}></span>
                </OverlayTrigger>
            );
        } else {
            return "";
        }
    }

    getLockMachinePopover(props) {
        return (
            <Popover className="myPopover" title="Lock machine">
                <Input type="text" label="Please state your name and the reason to lock" ref="lockMessage" placeholder="e.g. Mary: load test on this Tuesday"/>
                <Button bsStyle="primary" onClick={() => props.onLockMachine(props.machineId, true, this.refs.lockMessage.getValue())}>Lock</Button>
            </Popover>
        );
    }

    getUnlockMachinePopover(props) {
        return (
            <Popover className="myPopover" title="Unlock machine">
                <p className="lockMessage">{props.status.lockMessage}</p>
                <p>Are you sure you want to unlock this machine?</p>
                <Button bsStyle="primary" onClick={() => props.onLockMachine(props.machineId, false, "")}>Yes</Button>
            </Popover>
        );
    }

    getMachineAccessibilityIcon(props) {
        console.info("props", props);
        if (!this.isWorkerAlive(props)) {
            return (
            <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${props.machineId}-Accessibility`}>{`"${props.status.worker}`}" has no response</Tooltip>}>
                <span className="machineActionIcon glyphicon glyphicon-remove-circle"></span>
            </OverlayTrigger>
            );
        } else if (props.status.lock) {
            return (
                <OverlayTrigger placement="bottom" trigger="click" rootClose overlay={this.getUnlockMachinePopover(props)}>
                    <span className="machineActionIcon glyphicon glyphicon-ban-circle"></span>
                </OverlayTrigger>
            );
        } else {
            return (
                <OverlayTrigger placement="bottom" trigger="click" rootClose overlay={this.getLockMachinePopover(props)}>
                    <span className="machineActionIcon glyphicon glyphicon-ok-circle"></span>
                </OverlayTrigger>
            );
        }
    }

    getPanelHeader(props) {
        return (
            <table className="headerGroup">
                <tr>
                    <td>
                        <span className={this.isWorkerAlive(props)?"headerLabel":"headerLabel notAlive"}>
                            <a href={`http://${props.status.setting.ACP_management_IP}`} target="_blank">ACP-{props.machineId}</a>
                        </span>
                    </td>
                    <td className="headerCommand">
                        {this.getSubmitJobIcon(props)}
                        {this.getMachineAccessibilityIcon(props)}
                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.getInfoPopover(props)}>
                            <span className="machineActionIcon glyphicon glyphicon-info-sign"></span>
                        </OverlayTrigger>
                    </td>
                </tr>
            </table>
        );
    }

    getInfoPopover(props) {
        return (
        <Popover id={`machineDetails-${props.machineId}`} title="Machine Details">
            <table className="propTable">
                <tbody>
                {this.makeProp("Worker", <a href={props.status.workerUrl} target="_blank">{props.status.worker}</a>)}
                {this.makeProp("Streamer", <a href={"http://" + props.status.setting.streamer + (props.status.setting.streamer.indexOf(":")==-1?":1234":"")} target="_blank">{props.status.setting.streamer}</a>)}
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

    decideRunningJobColor(info) {
        let { stopTime } = info;
        if (stopTime !== undefined)
            return "warning";
        return "info";
    }

    decideFinishedJobColor(info) {
        let { testSuiteName, result, finished, numSuccs, stopTime, endTime } = info;
        if (finished !== undefined && finished === "aborted")
            return "warning";
        if (testSuiteName !== undefined && endTime === undefined)
            return "warning";
        if (result !== undefined && result !== "success")
            return "danger";
        if (numSuccs !== undefined && numSuccs === 0)
            return "danger";
        return "success";
    }

    render() {
        try {
            //console.info("machine", this.props.machineId, " haveInfo = ", haveInfo);
            return (
                <Panel header={this.getPanelHeader(this.props)} className="machinePanel" bsStyle={this.props.status.lock?"danger":"default"}>
                    {this.isInfoValid(this.props) ?
                        <ListGroup fill>
                            {this.props.status.status.waiting && this.props.status.status.waiting.map(job => {
                                if (this.isConcernedJob(job, "waiting")) {
                                    return (
                                        <ListGroupItem key={job.ID}>
                                            <MachineJob key={job.ID} state="waiting" info={job}
                                                        workerUrl={this.props.status.workerUrl}
                                                        onKillJob={(jobId) => this.props.onKillJob(this.props.machineId, jobId)} />
                                        </ListGroupItem>
                                    );
                                } else {
                                    return "";
                                }
                            })}
                            {this.props.status.status.running && this.props.status.status.running.map(job => {
                                if (this.isConcernedJob(job[1], "running")) {
                                    return (
                                        <ListGroupItem key={job[1].ID} bsStyle={this.decideRunningJobColor(job[1])}>
                                            <MachineJob key={job[1].ID} state="running" info={job[1]}
                                                        workerUrl={this.props.status.workerUrl}
                                                        onKillJob={(jobId) => this.props.onKillJob(this.props.machineId, jobId)} />
                                        </ListGroupItem>
                                    );
                                } else {
                                    return "";
                                }

                            })}
                            {this.props.status.status.finished && this.props.status.status.finished.map((job, i) => {
                                if (this.isConcernedJob(job[1], "finished") && i < nFinishedToShow) {
                                    return (
                                        <ListGroupItem key={job[1].ID} bsStyle={this.decideFinishedJobColor(job[1])}>
                                            <MachineJob key={job[1].ID} state="finished" info={job[1]}
                                                        workerUrl={this.props.status.workerUrl}
                                                        onKillJob={(jobId) => this.props.onKillJob(this.props.machineId, jobId)} />
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
