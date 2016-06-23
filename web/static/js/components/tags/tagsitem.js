import React from 'react';
import {connect} from 'react-redux';
import {Button, Row, Col, Label, Panel, Table} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/tags.css';

class TagsItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    expclick(event) {
        this.setState({open: !this.state.open});
    }

    parseJsonToTable(json) {
        var content = [];
        var isArray = false;
        if (Array.isArray(json)) {
            isArray = true;
        }
        for (var key in json) {
            if (typeof json[key] !== 'object') {
                if (isArray)
                    content.push(<tr><td>{json[key]}</td></tr>);
                else
                    content.push(<tr><td>{key}</td><td>{json[key]}</td></tr>);
            }
            else {
                var nested = this.parseJsonToTable(json[key]);
                if (isArray)
                    content.push(<tr><td>{nested}</td></tr>);
                else
                    content.push(<tr><td>{key}</td><td>{nested}</td></tr>);
            }
        }
        return (
            <Table striped bordered condensed hover>
                <tbody>
                    {content}
                </tbody>
            </Table>
        )
    }

    render() {
        const {suite, name, detail, filter} = this.props;
        var test_type = ["input_type", "profile_type"];
        var video_key = ["output_codec", "output_resolution"];
        var audio_key = ["audios"]
        var gen_tags = detail['gen_tags'];
        var feature_tags = detail['feature_tags'];
        var asset;
        var general_labels = [];
        var video_labels = [];
        var audio_labels = [];
        var feature_labels = [];
        var all_labels = [name.toLowerCase()];
        if (gen_tags && gen_tags.length > 0) {
            for (var key in gen_tags[0]) {
                if (test_type.indexOf(key) !== -1) {
                    if (key === "input_type") {
                        asset = detail[gen_tags[0][key]];
                        if (asset)
                            all_labels.push(asset.toLowerCase());
                    }
                    general_labels.push(
                        <Label className="GeneralLabel">{gen_tags[0][key]}</Label>
                    );
                    all_labels.push(gen_tags[0][key].toLowerCase());
                }
            }
            for (var i = 0; i< video_key.length; i++) {
                video_labels.push(
                    <Label className="VideoLabel">{gen_tags[0][video_key[i]]}</Label>
                );
                all_labels.push(gen_tags[0][video_key[i]].toLowerCase());
            }
            for (var i = 0; i < gen_tags[0]['audios'].length; i++) {
                audio_labels.push(
                    <Label className="AudioLabel">{gen_tags[0]['audios'][i][0]}</Label>
                );
                all_labels.push(gen_tags[0]['audios'][i][0].toLowerCase());
            }
        }
        if (feature_tags && feature_tags.length > 0) {
            for (var i = 0; i < feature_tags.length; i++) {
                for (var j = 0; j < feature_tags[i].length; j++) {
                    feature_labels.push(
                        <Label className="FeatureLabel">{feature_tags[i][j]}</Label>
                    );
                    all_labels.push(feature_tags[i][j].toLowerCase());
                }
            }
        }
        var do_render = true;
        for (var index = 0; index < filter.length; index++) {
            if (all_labels.indexOf(filter[index].toLowerCase()) === -1) {
                do_render = false;
            }
        }
        var test_type_label = [];
        var collapse = "glyphicon glyphicon-chevron-down";
        if (this.state.open) {
            var collapse = "glyphicon glyphicon-chevron-up";
            var all_info = this.parseJsonToTable(detail);
        }
        return (
            <div>
            {   do_render &&
                <div>
                <div className="Item">
                    <div className="Collapse" onClick={this.expclick.bind(this)}>
                        <span className={collapse}></span>
                    </div>
                    <div className="TestInfo">
                        <div>
                            <span className="TestName">
                                {name}
                            </span>
                        </div>
                        <div>
                            <span className="TestSuite">
                                {suite}
                            </span>
                            <span className="TestAsset">
                                {asset}
                            </span>
                        </div>
                    </div>
                    <div className="GeneralLabels">
                        {general_labels}
                    </div>
                    <div className="MediaLabels">
                        <div className="VideoLabels">
                            {video_labels}
                        </div>
                        <div className="AudioLabels">
                            {audio_labels}
                        </div>
                    </div>
                    <div className="FeatureLabels">
                        {feature_labels}
                    </div>
                </div>
                <Panel collapsible expanded={this.state.open}>
                    {all_info}
                </Panel>
                </div>
            }
            </div>
        )
    }
}

function select(state) {
    return state.tags;
}

export default connect(select)(TagsItem);
