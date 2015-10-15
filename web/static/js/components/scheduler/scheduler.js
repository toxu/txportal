import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { Grid, ProgressBar, Row, Col, Panel, Alert } from 'react-bootstrap';
import Machine from './machine.js';
import { fetchStatus, lockMachine } from '../../actions/scheduler.js';
import "../../../css/scheduler.css"

class Scheduler extends Component{

    componentDidMount() {
        this.props.fetchStatus();
        this.timer = setInterval(() => this.props.fetchStatus(), this.props.updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    onLockMachine(machineId, lock) {
        console.info("this", this, "machineId", machineId, "lock", lock);
        this.props.lockMachine(machineId, lock);
    }

    render() {
        try {
            return (
                <div className="scheduler">
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
                                        />);
                            }
                        )}
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

export default connect(select, {fetchStatus, lockMachine})(Scheduler);
