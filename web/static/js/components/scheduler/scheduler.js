import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { Glyphicon, Input, option, Button, Modal, Grid, ProgressBar, Row, Col, Panel, Alert } from 'react-bootstrap';
import Machine from './machine.js';
import { fetchStatus, lockMachine, createJob, showCreateJobModal } from '../../actions/scheduler.js';
import "../../../css/scheduler.css"

class Scheduler extends Component{

    getCreateJobModal(props) {
        return (
            <Modal show={props.createJobModal.isVisible}
                   onHide={props.showCreateJobModal.bind(null, props.createJobModal.machineId, false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create job for ACP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Grid className="createJobForm">
                            <Col md={12}>
                                <Input type="select" ref="createJob_Machine" label="Machine"
                                       defaultValue={props.createJobModal.machineId} onChange={()=>this.props.showCreateJobModal(this.refs.createJob_Machine.getValue(), true)}>
                                    {Object.keys(props.machines).map(machine => {
                                        return <option key={`createJob_machine_${machine}`} value={machine}>
                                            ACP-{machine}</option>;
                                    })}
                                </Input>
                            </Col>
                            <Col md={6}>
                                <Input type="select" ref="createJob_Suite" label="Test Suite">
                                    {props.createJobModal.machineId !== "unknown" && props.machines[props.createJobModal.machineId].setting.supported_test_types.map(type => {
                                        return <option key={`createJob_Suite_${type}`} value={type}>{type}</option>;
                                    })}
                                </Input>
                            </Col>
                            <Col md={6}>
                                <Input type="text" ref="createJob_Build" label="ACP Build" placeholder="e.g. trunk, 1.2.x.0, 1.2.0.0.180" />
                            </Col>
                            <Col md={12}>
                                <Input type="text" ref="createJob_Subset" label="Subset" placeholder="comma-separated test cases e.g. BC_AC3, BC_*, ..." />
                            </Col>
                            <Col md={12}>
                                <Input type="text" ref="createJob_Tag" label="Tag" placeholder="e.g. HEVC, 'core' in tags and 'feature' in tags" />
                            </Col>
                            <Col md={6}>
                                <Input type="number" ref="createJob_Repeat" label="Repeat" placeholder="0" />
                            </Col>
                            <Col md={6}>
                                <Input type="number" ref="createJob_Retry" label="Retry" placeholder="0" />
                            </Col>
                            <Col md={12}>
                                <Input type="checkbox" ref="createJob_Publish" label="Publish" />
                            </Col>
                        </Grid>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => {
                        let param = {};
                        let setValue = (p, name, v) => {
                            if (v) {
                                p[name] = v;
                            }
                        }
                        setValue(param, "setting", this.refs.createJob_Machine.getValue());
                        setValue(param, "suite", this.refs.createJob_Suite.getValue());
                        setValue(param, "build", this.refs.createJob_Build.getValue());
                        setValue(param, "repeat", this.refs.createJob_Repeat.getValue());
                        setValue(param, "retry", this.refs.createJob_Retry.getValue());
                        setValue(param, "publish", this.refs.createJob_Publish.getChecked());

                        if (this.refs.createJob_Subset.getValue()) {
                            let list = this.refs.createJob_Subset.getValue().split(",").map((s) => s.trim());
                            setValue(param, "subset", list);
                        }

                        if (this.refs.createJob_Tag.getValue()) {
                            let list = this.refs.createJob_Tag.getValue().split(",").map((s) => s.trim());
                            setValue(param, "tag", list);
                        }
                        param["trigger"] = "manual";
                        console.info("param", param);
                        this.props.showCreateJobModal(this.refs.createJob_Machine.getValue(), false);
                        this.props.createJob(param);
                    }}>Create</Button>
                    <Button onClick={props.showCreateJobModal.bind(null, props.createJobModal.machineId, false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    componentDidMount() {
        this.props.fetchStatus();
        this.timer = setInterval(() => this.props.fetchStatus(), this.props.updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    onLockMachine(machineId, lock, lockMessage) {
        console.info("this", this, "machineId", machineId, "lock", lock, "lockMessage", lockMessage);
        this.props.lockMachine(machineId, lock, lockMessage);
    }

    render() {
        try {
            return (
                <div className="scheduler">
                    {this.getCreateJobModal(this.props)}
                    { this.props.connectionLost &&
                    <Alert bsStyle="warning">
                        <strong>WARNING:</strong> Connection to Scheduler is lost!
                    </Alert>
                    }
                    { this.props.isFetching && Object.keys(this.props.machines).length === 0 &&
                    <div>
                        <p>Now fetching, please wait...</p>
                        <ProgressBar active now={100}/>
                    </div>
                    }
                    { Object.keys(this.props.machines).length !== 0 &&
                    <div className="machineBox">
                        {Object.keys(this.props.machines).map(key => {
                                return (
                                    <Machine
                                        key={key}
                                        status={this.props.machines[key]}
                                        machineId={key}
                                        onLockMachine={this.onLockMachine.bind(this)}
                                        showCreateJobModal={(machineId, show) => this.props.showCreateJobModal(machineId, show)}
                                        />);
                            }
                        )}
                        <div className="topmostRefreshButton">
                            <Button onClick={this.props.fetchStatus}><Glyphicon glyph="repeat"/></Button>
                        </div>
                    </div>
                    }
                </div>
            );
        } catch (e) {
            console.info("Error occurred: ", e.stack);
            return <div>Error occurred: {e.message}</div>
        }
    }
}

// TODO modify
Scheduler.propTypes = {
    isFetching: PropTypes.bool,
    updateInterval: PropTypes.number,
    machines: PropTypes.object
};

function select(state) {
    return state.scheduler;
}

export default connect(select, {fetchStatus, lockMachine, createJob, showCreateJobModal})(Scheduler);
