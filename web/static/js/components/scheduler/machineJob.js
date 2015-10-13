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

    getTranscodeJobInfoOverlay(info, state) {
        const { startTime, ID, transcodePackBuild } = info;
        let properties = [];
        let startDate = this.parseTime(startTime);
        properties.push(["Start Time:", dateToString(startDate)]);
        if (state == "running") {
            properties.push(["Duration:", strFromDuration(new Date() - startDate)]);
        }
        properties.push(["RSTP build:", transcodePackBuild]);
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

    wrapWithOverlay(content) {
        return(
        <OverlayTrigger trigger={["click"]} placement="bottom"
                        overlay={this.getTranscodeJobInfoOverlay(this.props.info, this.props.state)}>
            {content}
        </OverlayTrigger>);
    }

    render() {
        let content = (
            <div>
                {`state=${this.props.state} info=${this.props.info}`}
            </div>);
        switch(this.props.state) {
            case "waiting":
                // the info should be an object containing property
                const { job, user } = this.props.info;

                if (job == "run_test") {
                    const { suite, subset, tag } = this.props.info;
                    content = (
                        <div>
                            Run {suite} test
                            {subset && subset.length > 0 ? ` (${subset.join(", ")})` : ""}
                            {tag && tag.length > 0 ? ` with tag (${tag.join(", ")})` : ""}
                        </div>
                    );
                } else if (job == "upgrade") {
                    const { build } = this.props.info;
                    content = (
                        <div>
                            Upgrade ACP to build {build}
                        </div>
                    );
                } else if (job == "clean") {
                    content = (
                        <div>
                            Free disk space
                        </div>
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
                let runContent = <div></div>;
                if (type === "upgrade") {
                    // upgrade job
                    runContent = (
                        <Grid className="machineJobGroup">
                            <Row>
                                <Col md={8}>Upgrading ACP to build {this.props.info.upgrade}</Col>
                                <Col md={4}><ProgressBar className="progressBar" active now={100}/></Col>
                            </Row>
                        </Grid>
                    );
                } else if (type === "transcode") {
                    // run test
                    const { testSuiteName, subset, tag, acpBuild, progress } = this.props.info;
                    let [, done, total] = /(\d+)\/(\d+)/.exec(progress);
                    let percent = (100 * parseInt(done)) / parseInt(total);
                    runContent = (
                        <Grid className="machineJobGroup">
                            <Row>
                                <Col md={8}>Running {testSuiteName} test on build {acpBuild}</Col>
                                <Col md={4} className="endItem"><ProgressBar className="progressBar" active
                                                                             label={progress} now={percent}/></Col>
                            </Row>
                        </Grid>
                    );
                } else if (type === "clean") {
                    // clean job
                    runContent = (
                        <div>
                            Free up disk space
                        </div>
                    );
                }

                content = this.wrapWithOverlay(runContent);

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
                } else if (this.props.info.clean) {
                    type = "clean";
                }
                const { finished, result } = this.props.info;
                let ago;
                if (finished === "aborted") {
                    ago = "aborted";
                } else {
                    ago = timeSince(new Date(finished)) + " ago";
                }
                let message = {};
                if (type === "upgrade") {
                    const { upgrade, timestamp } = this.props.info;
                    let isShowIcon = result === "success" && finished !== "aborted";
                    message = <td>{this.getResultIcon(isShowIcon)} Upgraded ACP to build {upgrade}</td>;
                } else if (type === "transcode") {
                    const { testSuiteName, acpBuild, timestamp, testSuiteNumOfCase } = this.props.info;
                    let { numSuccs } = this.props.info;
                    if (!numSuccs) {
                        numSuccs = 0;
                    }
                    let isShowIcon = finished !== "aborted" && numSuccs != 0;
                    let resultUrl = resultUrlPrefix + timestamp;
                    message =
                        <td>{this.getResultIcon(isShowIcon)} Completed {testSuiteName} test on build {acpBuild}: <a
                            href={resultUrl}>{numSuccs}/{testSuiteNumOfCase}</a></td>;
                } else if (type === "clean") {
                    let isShowIcon = finished !== "aborted";
                    message = <td>{this.getResultIcon(isShowIcon)} Freed up disk space</td>;
                } else {
                    message = <td>Unknown job</td>;
                }
                content = (
                    <Grid className="machineJobGroup">
                        <Row>
                            <Col md={8}>{message}</Col>
                            <Col md={4} className="endItem">{ago}</Col>
                        </Row>
                    </Grid>
                );
                break;
            }
        }
        return content;
    }
}
