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
        const { startTime, ID, transcodePackBuild, progress, finished, stopTime } = info;
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
                        let [done, transcoded, total] = this.parseProgress(progress);
                        let remaining = total - done;
                        let remainingTime = "\u221E";
                        if (done && total) {
                            remainingTime = strFromDuration(remaining * duration / done);
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

        if (stopTime) {
            let stopDate = this.parseTime(stopTime);
            properties.push(["Abort time:", dateToString(stopDate)]);
        }

        if (state === "running") {
            properties.push(["Stop now:", this.makeStopJobButton(info)]);
        }

        // debug // replaced by title
        //properties.push(["Details:", (<OverlayTrigger trigger="hover" placement="bottom" overlay={<Popover className="myLargePopover" title="Details for Debug">{JSON.stringify(info)}</Popover>}>
        //    <span className="glyphicon glyphicon-list-alt" onClick={e => {e.stopPropagation()}}/>
        //</OverlayTrigger>)]);

        if (properties.length === 0) {
            throw new Error("No info");
        }

        let title = <div>Job Information &nbsp;
                        <OverlayTrigger trigger="hover" placement="bottom" overlay={<Popover className="myLargePopover" title="Debug Information"><pre>{JSON.stringify(info, null, '\t')}</pre></Popover>}>
                            <span className="glyphicon glyphicon-list-alt" onClick={e => {e.stopPropagation()}}/>
                        </OverlayTrigger>
                    </div>;

        return (
            <Popover id={ID} className="myPopover" title={title}>
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
                <span className="machineJobLink">{content}</span>
            </OverlayTrigger>);
        } catch (e) {
            return content;
        }
    }

    // [pass, done, total]
    parseProgress(progress) {
        try {
            let [, done, transcoded, total] = /(\d+)\/(\d+)\/(\d+)/.exec(progress);
            return [parseInt(done), parseInt(transcoded), parseInt(total)];
        } catch (e) {
            //console.info("Error occurred: ", e.stack);
            try {
                let [, done, total] = /(\d+)\/(\d+)/.exec(progress);
                return [parseInt(done), parseInt(done), parseInt(total)];
            } catch (e) {
                //console.info("Error occurred: ", e.stack);
                return [0, 0, 0];
            }
        }
    }

    isResultOkay(info) {
        let { testSuiteName, result, finished, numSuccs, stopTime, endTime } = info;
        if (result !== undefined && result !== "success")
            return false;
        if (testSuiteName === undefined) {
            // for other
            if (finished !== undefined && finished === "aborted")
                return false;
        } else {
            // for transcoding
            if (numSuccs === undefined || numSuccs === 0)
                return false;
        }
        return true;
    }

    makeStopJobConfirmPopover(info, stopJobID) {
        if (info.ID) {
            return (
            <Popover title="Stop the job">
                Are you sure you want to stop the job?
                <hr className="thinDivider"/>
                <Button bsStyle="danger" onClick={() => {this.props.onKillJob(info.ID); React.findDOMNode(this.refs[stopJobID]).click()}}>Yes</Button>
            </Popover>
            );
        } else {
            return <Popover title="Error: no ID"></Popover>;
        }
    }

    makeStopJobIcon(info) {
        let stopJobID = `stopJob${info.ID}`; // this is the ID assigned to the button node
        return (
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.makeStopJobConfirmPopover(info, stopJobID)}>
                <span ref={stopJobID} className="invisibleLink glyphicon glyphicon-remove" onClick={e => {e.stopPropagation()}}/>
            </OverlayTrigger>
        );
    }

    makeStopJobButton(info) {
        let stopJobID = `stopJobButton${info.ID}`; // this is the ID assigned to the button node
        return (
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.makeStopJobConfirmPopover(info, stopJobID)}>
                <Button ref={stopJobID} bsSize="small" bsStyle="danger">Stop</Button>
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
                                    {tag && tag.length > 0 ? ` with tag (${tag.join(", ")})` : ""} {this.makeStopJobIcon(this.props.info)}
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
                                    Pending to upgrade ACP to build {build} {this.makeStopJobIcon(this.props.info)}
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
                    } else if (this.props.info.clean) {
                        type = "clean";
                    }
                    let runContent = (
                    <Grid className="machineJobGroup">
                        <Row>
                            <Col md={12}>Fetching information ...</Col>
                        </Row>
                    </Grid>);
                    const { testSuiteName, stopTime, subset, tag, acpBuild, progress, timestamp } = this.props.info;
                    if (type === "upgrade") {
                        // upgrade job
                        let jobTitle = (stopTime?'Stopping upgrade':'Upgrading') + ` ACP to build ${this.props.info.upgrade}`;
                        runContent = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={8}>{this.wrapWithOverlay(type, jobTitle)} {this.makeStopJobIcon(this.props.info)}</Col>
                                    <Col md={4}>
                                        <a href={`${this.props.workerUrl}/result/${timestamp}`} target="_blank">
                                            <ProgressBar className="progressBar" active min={-20} now={100}/>
                                        </a>
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    } else if (type === "transcode") {
                        // run test
                        let [done, transcoded, total] = this.parseProgress(progress);
                        let jobTitle = (stopTime?'Stopping':'Running') + ` ${testSuiteName} test on build ${acpBuild}`;
                        runContent = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={8}>{this.wrapWithOverlay(type, jobTitle)} {this.makeStopJobIcon(this.props.info)}</Col>
                                    <Col md={4} className="endItem">
                                        <a href={`${this.props.workerUrl}/result/${timestamp}`} target="_blank">
                                            <ProgressBar className="progressBar">
                                                <ProgressBar active bsStyle="default" label={progress} min={-(total * 30 / 100)} now={done} max={total} key={1}/>
                                                <ProgressBar bsStyle="info" active now={transcoded - done} key={2}/>
                                            </ProgressBar>
                                        </a>
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    } else if (type == "clean") {
                        let jobTitle = 'Freeing up disk space';
                        runContent = (
                            <Grid className="machineJobGroup">
                                <Row>
                                    <Col md={8}>{jobTitle}</Col>
                                    <Col md={4}>
                                        <a href={`${this.props.workerUrl}/result/${timestamp}`} target="_blank">
                                            <ProgressBar className="progressBar" active min={-20} now={100}/>
                                        </a>
                                    </Col>
                                </Row>
                            </Grid>
                        );
                    }
                    content = runContent;
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
                    let resultText = "";
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
                        if (publish === undefined || publish === true) {
                            resultText = <a href={resultUrl} target="_blank">{numSuccs}/{testSuiteNumOfCase}</a>;
                        } else {
                            resultText = `${numSuccs}/${testSuiteNumOfCase}`;
                        }
                        message =
                            <span>{this.getResultIcon(this.isResultOkay(this.props.info))} Completed {testSuiteName} test on build {acpBuild}: </span>;
                    } else {
                        message = <span>Unknown job</span>;
                    }
                    let finishedContent = (
                        <Grid className="machineJobGroup">
                            <Row>
                                <Col md={10}>{this.wrapWithOverlay(type, message)} {resultText} <a href={`${this.props.workerUrl}/result/${timestamp}`} target="_blank"><span className="invisibleLink glyphicon glyphicon-link"/></a></Col>
                                <Col md={2} className="endItem">{ago}</Col>
                            </Row>
                        </Grid>
                    );
                    content = finishedContent;
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
