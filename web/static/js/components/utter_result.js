import React from 'react';
import '../../css/utter.css';
import * as bs from 'react-bootstrap';

class UtterRv extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    componentDidMount() {
    }

    open() {
        // Though react-bootstrap is doing steState directly,
        // but should we route via redux in txportal?
        this.setState({showModal: true});
    }

    close() {
        // Though react-bootstrap is doing steState directly,
        // but should we route via redux in txportal?
        this.setState({showModal: false});
    }

    render() {
        const { content, key } = this.props;
        var tileStatus = 'tile-status';
        var iconStatus = 'icon-status';
        if (content.value.result.error != undefined && content.value.result.error != "") {
            tileStatus += ' errored';
            iconStatus += ' errored';
        } else {
            tileStatus += ' passed';
            iconStatus += ' passed';
        }

        var author = content.value["commit"].author;
        var svnLink = "http://hsvn/viewvc/repo?view=revision&revision=" + content.key;
        var authorLink = "http://jira/secure/ViewProfile.jspa?name=" + author;

        var id = 0;
        var gtest_keys = <div/>;
        var gtest_body = <div/>;
        if (content.value.result != undefined && content.value.result.gtest != undefined){
            gtest_keys = Object.keys(content.value.result.gtest);
            var gtest_table_body = gtest_keys.map(
                (k) => {
                    if (content.value.result.gtest[k].errors > 0 || content.value.result.gtest[k].failures > 0)
                        return(
                        <tr>
                        <td>{k}</td>
                        <td>{content.value.result.gtest[k].errors}/{content.value.result.gtest[k].tests}</td>
                        <td>{content.value.result.gtest[k].failures}/{content.value.result.gtest[k].tests}</td>
                        </tr>);
                    else
                        return 0;
                }
            ).filter((b) => {return b != 0;});

            gtest_body =
                <bs.Table striped bordered condensed hover>
                <thead>
                <tr>
                <th>Unit test name</th>
                <th>Errors</th>
                <th>Failures</th>
                </tr>
                <tbody>
                {gtest_table_body}
                </tbody>
                </thead>
                </bs.Table>;
        }

        var titleOverlay = <bs.Tooltip>{content.value["commit"].msg}</bs.Tooltip>;
        return (
           <div className="utter-result-item" key= {key}>
                <div className={tileStatus}>
                <span className={iconStatus} title="passed"/>
                </div>
                <div className="tile-main">
                <bs.OverlayTrigger trigger="hover" overlay={titleOverlay}>
                <h2><a className="tile-commit-message" href={svnLink} target="_blank">{content.value["commit"].msg}</a></h2>
                </bs.OverlayTrigger>
                <div className="tile-author">
                <a href={authorLink} target="_blank">{author}</a> commited
                </div>
                </div>
                <div className="tile-additional">
                <div>rev: <a className="tile-commit-message" href={svnLink} target="_blank">{content.key}</a></div>
                <div>error: {content.value.result.error} <a href="#" onClick={this.open.bind(this)}>(detail)</a></div>
                </div>

                <bs.Modal show={this.state.showModal} onHide={this.close.bind(this)}>
                <bs.Modal.Header closeButton>
                <bs.Modal.Title>Failed gtest</bs.Modal.Title>
                </bs.Modal.Header>
                <bs.Modal.Body>
                {gtest_body}
                </bs.Modal.Body>
                </bs.Modal>
            </div>

        );
    }
}

export default UtterRv;
