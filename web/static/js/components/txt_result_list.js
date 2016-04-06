import React from 'react';
import {connect} from 'react-redux';
import {fetchTxtRv, setFilter, setDateInfo, filterByRatio} from '../actions/txt_results';
import {Button, Row, Col, ProgressBar} from 'react-bootstrap';

import TxtRv from './txt_result';
var DateRangePicker = require('react-bootstrap-daterangepicker');
var moment = require('moment');



// CSS
import 'react-bootstrap-daterangepicker/css/daterangepicker.css';
import '../../css/txt_results_list.css';
import 'bootstrap/dist/css/bootstrap.min.css';

var $ = require("jquery");


class TxtResultList extends React.Component{
	constructor(props) {
		super(props);
	}

	componentDidMount() {
        this.props.dispatch(fetchTxtRv());
        this.props.dispatch(setDateInfo(moment().subtract(29,'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')));
        console.log(this.props.updateInterval);
        this.timer = setInterval(() => this.props.dispatch(fetchTxtRv()), this.props.updateInterval);
	}

    componentWillUnmount() {
        clearInterval(this.timer);
    }

	onKeyUp(event) {
        this.props.dispatch(setFilter(event.target.value));
    }

    onKeyUpRatio(event){
		this.props.dispatch(filterByRatio(event.target.value));
    }

    onApply(event, picker){
    	this.props.dispatch(setDateInfo(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD')));
    }

	render() {
		const {dispatch, rows, startDate, endDate, filterByName, filterByRSTP, filterByTag, filterByRatio, isFetching} = this.props;
		var ranges = {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				};

		var start = moment(startDate);
		var end = moment(endDate);
		var label = startDate + ' - ' + endDate;

        var content = rows.map(
            (row) => {
                return (
                        <TxtRv result={row} />
                );
            }
        );
		return (
		<div className="TXT_results">
		<Row>
			<input className="filter" type="text" id="search" placeholder="Type to search ACP Build" onKeyUp={this.onKeyUp.bind(this)}/>
			<input className="ratio" type="text" placeholder="Ratio e.g. 0~1" onKeyUp={this.onKeyUpRatio.bind(this)} />
			<Col md = {2}>
				<DateRangePicker startDate={start} endDate={end} ranges={ranges} onApply={this.onApply.bind(this)}>
					<Button className="selected-date-range-btn">
						<div className="pull-left"><span className="glyphicon glyphicon-calendar" /></div>
						<div className="pull-right">
							<span>
								{label}
							</span>
							<span className="caret"></span>
						</div>
					</Button>
				</DateRangePicker>
			</Col>
		</Row>
		<Row>
            { this.props.isFetching && this.props.rows.length === 0 &&
                <div>
                    <p>Now fetching, please wait...</p>
                    <ProgressBar active now={100}/>
                </div>
            }
			<div className="TxtRVs">
				{content}
			</div>
		</Row>
  		</div>
		)

	}
}

function formatDate(testName){
		try{
		if(testName.indexOf('jenkins') == -1 && testName.indexOf('results') == -1){
			var date_arr = testName.split('-');
			var year = date_arr[0].substring(0,4);
			var month = date_arr[0].substring(4,6);
			var day = date_arr[0].substring(6);
			var hour = date_arr[1].substring(0,2);
			var minute = date_arr[1].substring(2,4);
			var second = date_arr[1].substring(4);
			return [year, month, day].join('/') + " " + [hour, minute, second].join(':');
		}
		else if(testName.indexOf('jenkins') != -1){
			var date_arr = testName.split('_');
			var year = date_arr[2].split('-')[0];
			var month = date_arr[2].split('-')[1];
			var day = date_arr[2].split('-')[2];
			var hour = date_arr[3].substring(0,2);
			var minute = date_arr[3].substring(2,4);
			return [year, month, day].join('/') + " " + [hour, minute].join(':');
		}
		else if(testName.indexOf('results') != -1){
			var date_arr = testName.split('-');
			var year = date_arr[1].substring(0,4);
			var month = date_arr[1].substring(4,6);
			var day = date_arr[1].substring(6);
			var hour = date_arr[2].substring(0,2);
			var minute = date_arr[2].substring(2,4);
			var second = date_arr[2].substring(4);
			return [year, month, day].join('/') + " " + [hour, minute, second].join(':');
		}
		else{
			return "unknown";
		}
		}
		catch(err){
			return "unknown";
		}
}

function sortByDate(a,b){
	try{
		var date_a = a[7].match(/\d/g);
		date_a = date_a.join('');
	}
	catch(e){
		var date_a = "00000000000000";
	}
	try{
		var date_b = b[7].match(/\d/g);
		date_b = date_b.join('');
	}
	catch(e){
		var date_b = "00000000000000";
	}
	while(date_a.length <14){
		date_a += '0';
	}
	while(date_b.length < 14){
		date_b += '0';
	}
	return parseInt(date_b) - parseInt(date_a);
}

function sortByACP(a,b){
	try{
		var build_a = a[2];
		var build_b = b[2];
	}
	catch(e){
		var build_a = "0.0.0.0.0";
		var build_b = "0.0.0.0.0";
	}
	try{
		var val_a = build_a.match(/(\d+)/g);
		var val_b = build_b.match(/(\d+)/g);
	}
	catch(e){
		var val_a = ['0','0','0','0','0'];
		var val_b = ['0','0','0','0','0'];
	}
	var length = Math.min(val_a.length, val_b.length);
	for(var i=0;i<length;i++){
		if(val_a[i]-val_b[i] > 0)
			return -1;
		if(val_a[i]-val_b[i] <0)
			return 1;
	}
	return 0;
}

function filterByDate(rows, startDate, endDate){
	try{
		var start = startDate.match(/\d/g);
		start = start.join('');
		start = parseInt(start);
	}
	catch(e){
		start = 0;
	}
	try{
		var end = endDate.match(/\d/g);
		end = end.join('');
		end = parseInt(end);
	}
	catch(e){
		end = 99999999;
	}
	var filtered_rows = rows.filter(
		row => {
			try{
				var date = row[7].match(/\d/g);
				date = date.join('');
			}
			catch(e){
				var date = "00000000";
			}
			if(date.length > 8){
				date = date.substring(0,8);
			}
			else{
				while(date.length < 8){
					date += '0';
				}
			}
			date = parseInt(date);
			if(date>=start && date<=end){
				return true;
			}
			else{
				return false;
			}
		}
	);
	return filtered_rows;
}

function filterByName(rows, name){
	if(name == "" || name == undefined){
		return rows;
	}
	var filtered_rows = rows.filter(
		row => {
			var ip = row[3];
			if(ip.indexOf(name) != -1)
				return true;
			else
				return false;
		}
	);
	return filtered_rows;
}

function filterByRSTP(rows, build){
	if(build == "" || build == undefined || build =="TXP-"){
		return rows;
	}
	var filtered_rows = rows.filter(
		row => {
			var RSTP = row[4];
			if(RSTP.indexOf(build) != -1)
				return true;
			else
				return false;
		}
	);
	return filtered_rows;
}

function filterByTag(rows, tag){
    console.log(tag);
	if(tag.length == 0 || tag == undefined){
		return rows;
	}
	var filtered_rows = rows.filter(
		row => {
			var testSuit = row[5];
            for(var t of tag){
                if(testSuit.indexOf(t) != -1)
                    return true;
            }
            return false;
		}
	);
	return filtered_rows;
}

function filterByRate(rows, ratio){
	if(ratio == "" || ratio == undefined){
		return rows;
	}
	if(ratio.indexOf('~') != -1){
		var l = parseFloat(ratio.split('~')[0]);
		var h = parseFloat(ratio.split('~')[1]);
	}
	else{
		var l = 0;
		var h = parseFloat(ratio);
	}
	var filtered_rows = rows.filter(
		row => {
			var ratio = row[0];
			if(ratio >= l && ratio <= h)
				return true;
			else
				return false;
		}
	);
	return filtered_rows;
}

function createRows(result, filter, startDate, endDate, name, rstp, tag, ratio){
		if(result === undefined){
			result = [];
		}
		var rows = result.map(
			(result) => {
				var passRatio = result.value[6];
				var passed = parseFloat(passRatio.split('/')[0]);
				var total = parseFloat(passRatio.split('/')[1]);

				var TestName = result.value[0];
				var ACPBuild = result.value[2];
				var ACPIP = result.value[3];
				var RSTPBuild = result.value[4];
				var testSuit = result.value[5];

				var date = formatDate(TestName);
				return [passed/total, TestName, ACPBuild, ACPIP, RSTPBuild, testSuit, passRatio, date];
			}
		);
		rows = filterByDate(rows, startDate, endDate);
		rows = filterByName(rows, name);
		rows = filterByRSTP(rows, rstp);
		rows = filterByTag(rows, tag);
		rows = filterByRate(rows, ratio);
		if(filter == "")
			return rows.sort(sortByDate);
		else{
			var filtered_rows = rows.filter(
				row => {
					var ACPBuild = row[2];
					if(ACPBuild.indexOf(filter) != -1)
						return true;
					return false;
				}
			);
			return filtered_rows.sort(sortByACP);
		}
}

function select(state) {
    //return state.loadTxtRv;
    var rows = state.loadTxtRv.items.rows;
    var filter = state.loadTxtRv.filter;
    var startDate = state.loadTxtRv.startDate;
    var endDate = state.loadTxtRv.endDate;
    var filterByName = state.loadTxtRv.filterByName;
    var filterByRSTP = state.loadTxtRv.filterByRSTP;
    var filterByTag = state.loadTxtRv.filterByTag;
    var filterByRatio = state.loadTxtRv.filterByRatio;
    var isFetching = state.loadTxtRv.isFetching;
    var updateInterval = state.loadTxtRv.updateInterval;
    return{
    	rows: createRows(rows, filter, startDate, endDate, filterByName, filterByRSTP, filterByTag, filterByRatio),
    	startDate: startDate,
    	endDate: endDate,
    	filterByName: filterByName,
    	filterByRSTP: filterByRSTP,
    	filterByTag: filterByTag,
    	filterByRatio: filterByRatio,
        isFetching: isFetching,
        updateInterval: updateInterval
    };
}

export default connect(select)(TxtResultList);
