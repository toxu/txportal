import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { ListGroup, ListGroupItem, Table, Well, Grid, ProgressBar, Row, Col, Panel, Button } from 'react-bootstrap';
import { timeSince } from '../utils.js';
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
                if (this.props.info.upgrade) {
                    // upgrade job
                    content = (
                        <div>
                            Upgrading ACP to build {this.props.info.upgrade}
                        </div>
                    );
                } else if (this.props.info.testSuiteName) {
                    // run test
                    const { suite, subset, tag, acpBuild, progress } = this.props.info;
                    let [, done, total] = /(\d+)\/(\d+)/.exec(progress);
                    let percent = (100 * parseInt(done)) / parseInt(total);
                    content = (
                        <table className="machineJobGroup">
                            <tbody>
                            <tr>
                                <td>Running {suite} test on build {acpBuild}</td>
                                <td className="endCell">
                                    <ProgressBar className="progressBar" active label={progress} now={percent}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    );
                } else if (this.props.info.clean) {
                    // clean job
                    content = (
                        <div>
                            Free up disk space
                        </div>
                    );
                }
                break;
            case "finished":
            default:
                const { finished, result } = this.props.info;
                let ago;
                if (finished === "aborted") {
                    ago = "aborted";
                } else {
                    ago = timeSince(finished) + " ago";
                }
                let message = {};
                if (this.props.info.upgrade) {
                    const { upgrade, timestamp } = this.props.info;
                    let isShowIcon = result === "success" && finished !== "aborted";
                    message = <td>{this.getResultIcon(isShowIcon)} Upgraded ACP to build {upgrade}</td>;
                } else if (this.props.info.testSuiteName) {
                    const { testSuiteName, acpBuild, numSuccs, timestamp, testSuiteNumOfCase } = this.props.info;
                    let isShowIcon = finished !== "aborted" && numSuccs != 0;
                    let resultUrl = resultUrlPrefix + timestamp;
                    message = <td>{this.getResultIcon(isShowIcon)} Completed {testSuiteName} test on build {acpBuild}: <a href={resultUrl}>{numSuccs}/{testSuiteNumOfCase}</a></td>;
                } else if (this.props.info.clean) {
                    let isShowIcon = finished !== "aborted";
                    message = <td>{this.getResultIcon(isShowIcon)} Freed up disk space</td>;
                } else {
                    message = <td>Unknown job</td>;
                }
                content = (
                    <table className="machineJobGroup">
                        <tbody>
                        <tr>
                            {message}
                            <td className="endCellAgo">{ago}</td>
                        </tr>
                        </tbody>
                    </table>
                );
                break;
        }
        return content;
    }
}
