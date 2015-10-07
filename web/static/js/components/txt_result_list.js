import React from 'react';
import {connect} from 'react-redux';
import {fetchTxtRv, selectedTest, cancelSelectedTest} from '../actions/txt_results'
import {Button} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


// CSS
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import '../../css/txt_results_list.css';

var $ = require("jquery");


class TxtResultList extends React.Component{
	constructor(props) {
		super(props);
	}

	componentDidMount() {
        this.props.dispatch(fetchTxtRv());
	}

	list(){
		console.log("clicked");
		window.open("http://10.50.100.213:5984/_utils/multipages.html?"+ this.props.selected.toString());
	}

	render() {
		var result = this.props.items.rows;
		if(result === undefined){
			result = [];
		}
		var result_items = result.map(
					(result) => {
						var reslink = "http://10.50.100.213:5984/_utils/result-viewer.html?" + result.value[0];
						var peflink = "http://10.50.100.213:5984/_utils/perfchart.html?" + result.value[0];
						var ACPName;
						switch(result.value[3]){
							case "172.31.1.233":
								ACPName = "ACP233";
								break;
							case "172.31.1.234":
								ACPName = "ACP234";
								break;
							case "172.31.1.210":
								ACPName = "ACP210";
								break;
							case "10.21.129.21":
								ACPName = "Vlab";
								break;
							case "172.31.1.208":
								ACPName = "ACP208";
								break;
							default:
								ACPName = result.value[3];
								break;
						}
						return {
						"Link": <div><a target="_blank" href={reslink}>Result</a> & <a target="_blank" href={peflink}>PERF</a></div>,
						"Test Name": ACPName + '-' + result.value[0],
						"Branch": result.value[1],
						"ACP Build": result.value[2],
						"ACP IP": result.value[3],
						"RSTP Build": result.value[4],
						"Test Suit   (Passed/Total)": result.value[5] + " (" + result.value[6] + ")",
						"Pass Ratio": result.value[6]
						}
					}
				)
		function sortBuild(a, b, order){
				var build_a = a["ACP Build"].split(".");
				var build_b = b["ACP Build"].split(".");
				var val_a = "";
				var val_b = "";
				for(var i=0;i<build_a.length;i++){
					var item = build_a[i];
					item = parseInt(item).toString();
					if(item.length == 1) {
	                	val_a += "00" + item;
	            	} else if(item.length == 2) {
	                	val_a += "0" + item;
	            	} else {
	                	val_a += item;
	            	}
				}
				for(var i=0;i<build_b.length;i++){
					var item = build_b[i];
					item = parseInt(item).toString();
					if(item.length == 1) {
	                	val_b += "00" + item;
	            	} else if(item.length == 2) {
	                	val_b += "0" + item;
	            	} else {
	                	val_b += item;
	            	}
				}
				if(order=="asc")
					var res = ((parseInt(val_a) < parseInt(val_b)) ? -1 : ((parseInt(val_a) > parseInt(val_b)) ? 1 : 0));
				else
					var res = ((parseInt(val_a) < parseInt(val_b)) ? 1 : ((parseInt(val_a) > parseInt(val_b)) ? -1 : 0));
				return res
		}

		function sortName(a, b, order){
			var name_a = a["Test Name"].split("-");
			var name_b = b["Test Name"].split("-");
			var val_a = "";
			var val_b = "";

			for(var i=0;i<name_a.length;i++){
				var item = name_a[i];
				var isnum = /^\d+$/.test(item);
				if(isnum && item.length >= 6){
					val_a += item;
				}
			}
			for(var i=0;i<name_b.length;i++){
				var item = name_b[i];
				var isnum = /^\d+$/.test(item);
				if(isnum && item.length >=6){
					val_b += item;
				}
			}
			if(order=="asc")
				var res = ((parseInt(val_a) < parseInt(val_b)) ? -1 : ((parseInt(val_a) > parseInt(val_b)) ? 1 : 0));
			else
				var res = ((parseInt(val_a) < parseInt(val_b)) ? 1 : ((parseInt(val_a) > parseInt(val_b)) ? -1 : 0));
			return res
		}

		function onRowSelect(row, isSelected){
			if(isSelected){
				$("#listSelected").show();
				var selected = this.props.selected.slice();
				var name = row["Test Name"].split("-");
				name.shift();
				name = name.join("-");
				this.props.dispatch(selectedTest(name));
			}
			else{
				var selected = this.props.selected.slice();
				if(selected.length === 1){
					$("#listSelected").hide();
				}
				var name = row["Test Name"].split("-");
				name.shift();
				name = name.join("-");
				var index = selected.indexOf(name);
				this.props.dispatch(cancelSelectedTest(index));
			}
		}

		var selectRowProp = {
		  mode: "checkbox",
		  clickToSelect: "true",
		  bgColor: "#f0ad4e",
		  hideSelectColumn: "true",
		  onSelect: onRowSelect.bind(this)
		};

		return (
				<div class="fixedTable">
				<Button bsStyle="primary" id = "listSelected" onClick={this.list.bind(this)}>ListSelected</Button>
				<BootstrapTable data={result_items} pagination={true} columnFilter={true} striped={true} hover={true} selectRow={selectRowProp}>
					<TableHeaderColumn dataField="Link" width="80px">Link</TableHeaderColumn>
					<TableHeaderColumn dataField="Test Name" isKey={true} dataSort={true} sortFunc={sortName} width="150px">Test Name</TableHeaderColumn>
					<TableHeaderColumn dataField="ACP Build" width="100px" dataSort={true} sortFunc={sortBuild}>ACP Build</TableHeaderColumn>
					<TableHeaderColumn dataField="RSTP Build" width="100px">RSTP Build</TableHeaderColumn>
					<TableHeaderColumn dataField="Test Suit   (Passed/Total)" width="220px">Test Suit   (Passed/Total)</TableHeaderColumn>
				</BootstrapTable>
				</div>
		       )
	}
}


function select(state) {
    return state.loadTxtRv;
}

export default connect(select)(TxtResultList);
