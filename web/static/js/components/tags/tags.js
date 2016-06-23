import React from 'react';
import {connect} from 'react-redux';
import {getTags, selectAllSuite, selectOneSuite, searchTags} from '../../actions/tags.js';
import {Button, Row, Col, ProgressBar} from 'react-bootstrap';
import TagsItem from './tagsitem';

import PieChart from '../charts/piechart';
import BarChart from '../charts/barchart';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/tags.css';

var $ = require("jquery");

class Tags extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(getTags());
        this.timer = setInterval(() => this.props.dispatch(getTags()), this.props.updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    allSuiteClicked() {
        this.props.dispatch(selectAllSuite());
    }

    oneSuiteClicked(event) {
        this.props.dispatch(selectOneSuite($(event.target).text()));
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.props.dispatch(searchTags($(event.target).val()));
        }
    }

    handleKeyUp(event) {
        if ($(event.target).val() === "") {
            this.props.dispatch(searchTags(""));
        }
    }

    stat(tags) {
        var count = {};
        var interested_keys = ["profile_type", "input_type", "output_codec", "output_resolution"];
        var total = 0;
        for (var suite in tags) {
            for (var test in tags[suite]) {
                total++;
                if ('gen_tags' in tags[suite][test]) {
                    var gen_tags = tags[suite][test]['gen_tags'];
                    if (gen_tags.length > 0) {
                        for (var i = 0; i < interested_keys.length; i++) {
                            if (interested_keys[i] in gen_tags[0]) {
                                if (gen_tags[0][interested_keys[i]] in count) {
                                    count[gen_tags[0][interested_keys[i]]] ++;
                                } else {
                                    count[gen_tags[0][interested_keys[i]]] = 1;
                                }
                            }
                        }
                    }
                }
                if ('feature_tags' in tags[suite][test]) {
                    var feature_tags = tags[suite][test]['feature_tags'];
                    for (var i = 0; i < feature_tags.length; i++) {
                        for (var j = 0; j < feature_tags[i].length; j++) {
                            if (feature_tags[i][j] in count) {
                                count[feature_tags[i][j]]++;
                            } else {
                                count[feature_tags[i][j]] = 1;
                            }
                        }
                    }
                }
            }
        }
        count['total'] = total;
        var chart_data = [];
        for (var k in count) {
            chart_data.push({id: k, x: count[k]});
        }
        chart_data.sort(function(a, b) {return a.x - b.x});
        chart_data.reverse();
        return chart_data;
    }

    render() {
        const {tags, isFetching, activeSuite} = this.props;

        var activeTags = {};
        if (activeSuite.indexOf('All') !== -1) {
            activeTags = tags;
        } else {
            for (var suite in tags) {
                if (activeSuite.indexOf(suite) !== -1) {
                    activeTags[suite] = tags[suite];
                }
            }
        }

        if (activeSuite.indexOf('All') !== -1) {
            var suites = [<Button bsStyle='primary'>All</Button>];
        } else {
            var suites = [<Button onClick={this.allSuiteClicked.bind(this)}>All</Button>];
        }
        var items = [];
        var piechart_data = [];
        for (var suite in tags) {
            piechart_data.push({label: suite, count: Object.keys(tags[suite]).length})
            var bsStyle;
            if (activeSuite.indexOf(suite) !== -1) {
                bsStyle = 'primary'
            } else {
                bsStyle = 'default';
            }
            suites.push(
                <Button bsStyle={bsStyle} onClick={this.oneSuiteClicked.bind(this)}>{suite}</Button>
            );
            if (activeSuite.indexOf(suite) !== -1 || activeSuite.indexOf('All') !== -1) {
                for (var test_case in tags[suite]) {
                    items.push(
                        <TagsItem suite={suite} name={test_case} detail={tags[suite][test_case]} />
                    )
                }
            }
        }
        
        var chart_data = this.stat(activeTags);
        var domain = {
            x: [0, parseInt(chart_data[0].x)]
        };
        /*
        var piechart_data = [
            {label: 'Sanity', count: 100},
            {label: 'TS', count: 700},
            {label: 'SDI', count: 400},
            {label: 'PR', count: 300},
            {label: 'Else', count: 700}
        ];
        */
        var chart_props = {
            width: 600,
            height: 400
        };
        return (
            <div className="Tags">
                { isFetching && Object.keys(tags).length === 0 &&
                    <div>
                        <p>Now fetching, please wait...</p>
                        <ProgressBar active now={100}/>
                    </div>
                }
                { Object.keys(tags).length !== 0 &&
                    <div>
                    {
                        <div className="Graphs">
                            <PieChart
                                size={chart_props}
                                data = {piechart_data} />
                            <BarChart
                                size={chart_props}
                                data={chart_data}
                                domain={domain} />
                        </div>
                    }
                        <Row className="Control">
                            <div>
                                {suites}
                            </div>
                            <div>
                                <input className="filter" 
                                    placeholder="Search tags seperated by space"
                                    onKeyPress = {this.handleKeyPress.bind(this)}
                                    onKeyUp = {this.handleKeyUp.bind(this)}
                                />
                            </div>
                        </Row>
                        <Row>
                            <div>
                                {items}
                            </div>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}

function select(state) {
    return state.tags;
}

export default connect(select)(Tags);
