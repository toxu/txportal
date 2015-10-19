import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { OverlayTrigger, Popover, ListGroup, ListGroupItem, Table, Well, Grid, ProgressBar, Row, Col, Panel, Button } from 'react-bootstrap';
import { timeSince, strFromDuration, dateToString } from '../utils.js';
import '../../../css/common.css';
import '../../../css/scheduler.css';

// TODO make it configurable
let resultUrlPrefix = "http://10.50.100.213:5984/_utils/result-viewer.html?";

export default class MachineJob extends Component{

    getResultIcon(ok) {
        if (ok) {
            return <span className="glyphicon glyphicon-ok"></span>;
        } else {
            return <span className="glyphicon glyphicon-remove"></span>;
        }
    }

    parseTime(time) {
        let date;
        if (typeof(time) === "number") {
            date = new Date(time * 1000);
        } else {
            date = new Date(time);
        }
        return date;
    }

    getJobInfoOverlay(info, state) {
        const { startTime, ID, transcodePackBuild, progress, finished } = info;
        let properties = [];
        if (!ID) {
            throw new Error("Job has no ID, info = " + JSON.stringify(info));
        }
        if (startTime) {
            let startDate = this.parseTime(startTime);
            console.info("startDate", startDate, "startTime", startTime, "info", info);
            properties.push(["Start Time:", dateToString(startDate)]);
            if (finished) {
                properties.push(["Duration:", strFromDuration(new Date(finished) - startDate)]);
            } else {
                if (state == "running") {
                    let duration = new Date() - startDate;
                    if (progress) {
                        let percent = this.progressToPercent(progress);
                        let remainingPercent = 100 - percent;
                        let remainingTime = "\u221E";
                        if (percent) {
                            remainingTime = strFromDuration(remainingPercent * duration / percent);
                        }
                        properties.push(["Remaining time:", remainingTime]);
                    }
                    properties.push(["Duration:", strFromDuration(duration)]);
                }
            }
        }
        if (transcodePackBuild) {
            properties.push(["TXP build:", transcodePackBuild]);
        }
        if (progress) {
            let progressStr = typeof(progress) === "string"?progress:JSON.stringify(progress);
            properties.push(["Progress:", progressStr]);
        }
        if (properties.length === 0) {
            throw new Error("No info");
        }
        if (state === "running") {
            let button = <Button bsStyle="danger" bsSize="small">STOP</Button>
            properties.push(["Stop now?", button]);
        }
        return (
            <Popover id={ID} className="myPopover">
                <Grid className="propPanel">
                    {properties.map(p => {
                        return (
                            <Row key={p[0]}>
                                <Col md={5} className="key">{p[0]}</Col>
                                <Col md={7} className="value">{p[1]}</Col>
                            </Row>
                        );
                    })
                    }
                </Grid>
            </Popover>
        );
    }

    wrapWithOverlay(type, content) {
        try {
            let overlay = this.getJobInfoOverlay(this.props.info, this.props.state);
            return(
            <OverlayTrigger trigger={["click"]} rootClose placement="bottom"
                            overlay={overlay}>
                {content}
            </OverlayTrigger>);
        } catch (e) {
            return content;
        }
    }

    progressToPercent(progress) {
        try {
            let [, done, total] = /(\d+)\/(\d+)/.exec(progress);
            let percent = (100 * parseInt(done)) / parseInt(total);
            return percent;
        } catch (e) {
            console.info("Error occurred: ", e.stack);
            return 0;
        }
    }

    isResultOkay(info) {
        let { result, finished, numSuccs } = info;
        if (result !== undefined && result !== "success")
            return false;
        if (finished !== undefined && finished === "aborted")
            return false;
        if (numSuccs !== undefined && numSuccs === 0)
            return false;
        return true;
    }

    makeStopJobConfirmPopover(info) {
        if (info.ID) {
            return (
            <Popover title="Stop the job">
                Are you sure you want to stop the job?
                <hr className="thinDivider"/>
                <Button bsStyle="danger" onClick={() => this.props.onKillJob(info.ID)}>Yes</Button>
            </Popover>
            );
        } else {
            return <Popover title="Error: no ID"></Popover>;
        }
    }

    makeStopJobIcon(info) {
        return (
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.makeStopJobConfirmPopover(info)}>
                <span className="invisibleLink glyphicon glyphicon-remove" onClick={e => {e.stopPropagation()}}/>
            </OverlayTrigger>
        );
    }

    render() {
        try {
            let content = (
                <Grid className="machineJobGroup">
                    <Row>
                        <Col md={12}>
                        {`state=${this.props.state} info=${this.props.info}`}
                        </Col>
                    </Row>
                </Grid>);
            switch (this.props.state) {
                case "waiting":
                    // the info should be an object containing property
                    const { job, user } = this.props.info;

                    if (job == "run_test") {
                        const { suite, subset, tag } = this.props.info;
                        content = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={12}>
                                    Pending to run {suite} test
                                    {subset && subset.length > 0 ? ` (${subset.join(", ")})` : ""}
                                    {tag && tag.length > 0 ? ` with tag (${tag.join(", ")})` : ""}
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    } else if (job == "upgrade") {
                        const { build } = this.props.info;
                        content = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={12}>
                                    Pending to upgrade ACP to build {build}
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    }
                    break;
                case "running":
                {
                    let type = "unknown";
                    if (this.props.info.upgrade) {
                        type = "upgrade";
                    } else if (this.props.info.testSuiteName) {
                        type = "transcode";
                    }
                    let runContent = (
                    <Grid className="machineJobGroup">
                        <Row>
                            <Col md={12}>Fetching information ...</Col>
                        </Row>
                    </Grid>);
                    const { testSuiteName, subset, tag, acpBuild, progress, timestamp } = this.props.info;
                    if (type === "upgrade") {
                        // upgrade job
                        runContent = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={8}>Upgrading ACP to build {this.props.info.upgrade}</Col>
                                    <Col md={4}>
                                        <a href={`${this.props.workerUrl}/result/${timestamp}`}>
                                            <ProgressBar className="progressBar" active min={-20} now={100}/>
                                        </a>
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    } else if (type === "transcode") {
                        // run test
                        let percent = this.progressToPercent(progress);
                        runContent = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={8}>Running {testSuiteName} test on build {acpBuild} {this.makeStopJobIcon(this.props.info)}</Col>
                                    <Col md={4} className="endItem">
                                        <a href={`${this.props.workerUrl}/result/${timestamp}`}>
                                            <ProgressBar className="progressBar" active label={progress} min={-20} now={percent}/>
                                        </a>
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    }
                    content = this.wrapWithOverlay(type, runContent);
                    break;
                }
                case "finished":
                default:
                {
                    let type = "unknown";
                    if (this.props.info.upgrade) {
                        type = "upgrade";
                    } else if (this.props.info.testSuiteName) {
                        type = "transcode";
                    }
                    const { finished, result } = this.props.info;
                    let ago;
                    if (finished === "aborted") {
                        ago = "aborted";
                    } else {
                        ago = timeSince(new Date(finished)) + " ago";
                    }
                    let message = {};
                    const { timestamp } = this.props.info;
                    if (type === "upgrade") {
                        const { upgrade } = this.props.info;
                        message = <span>{this.getResultIcon(this.isResultOkay(this.props.info))} Upgraded ACP to build {upgrade}</span>;
                    } else if (type === "transcode") {
                        const { publish, testSuiteName, acpBuild, testSuiteNumOfCase } = this.props.info;
                        let { numSuccs } = this.props.info;
                        if (!numSuccs) {
                            numSuccs = 0;
                        }
                        let resultUrl = resultUrlPrefix + timestamp;
                        let resultText;
                        if (publish === undefined || publish === true) {
                            resultText = <a href={resultUrl}>{numSuccs}/{testSuiteNumOfCase}</a>;
                        } else {
                            resultText = `${numSuccs}/${testSuiteNumOfCase}`;
                        }
                        message =
                            <span>{this.getResultIcon(this.isResultOkay(this.props.info))} Completed {testSuiteName} test on build {acpBuild}: {resultText}</span>;
                    } else {
                        message = <span>Unknown job</span>;
                    }
                    let finishedContent = (
                        <Grid className="machineJobGroup">
                            <Row>
                                <Col md={9}>{message} <a href={`${this.props.workerUrl}/result/${timestamp}`}><span className="invisibleLink glyphicon glyphicon-link"/></a></Col>
                                <Col md={3} className="endItem">{ago}</Col>
                            </Row>
                        </Grid>
                    );
                    content = this.wrapWithOverlay(type, finishedContent);
                    break;
                }
            }
            return content;
        } catch (e) {
            console.info("Error occurred: ", e.stack);
            return <div>Error occurred: {e.message}</div>
        }
    }
}
