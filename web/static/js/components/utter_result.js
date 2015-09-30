import React from 'react';
import '../../css/utter.css';

class UtterRv extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { content, key } = this.props;
        var tileStatus = 'tile-status';
        var iconStatus = 'icon-status';
        if (content.value.error != undefined && content.value.error != "") {
            tileStatus += ' errored';
            iconStatus += ' errored';
        } else {
            tileStatus += ' passed';
            iconStatus += ' passed';
        }

        var author = content.value["target-commit"].author;
        var svnLink = "http://hsvn/viewvc/repo?view=revision&revision=" + content.key;
        var authorLink = "http://jira/secure/ViewProfile.jspa?name=" + author;
        return (
           <div className="utter-result-item" key= {key}>
                <div className={tileStatus}>
                <span className={iconStatus} title="passed"/>
                </div>
                <div className="tile-main">
                <h2><a className="tile-commit-message" href={svnLink} target="_blank">{content.value["target-commit"].msg}</a></h2>
                <div className="tile-author">
                <a href={authorLink} target="_blank">{author}</a> commited
                </div>
                </div>
                <div className="tile-additional">
                <div>
                <p>Rev: {content.key}</p>
                </div>
                </div>
            </div>
        );
    }
}

export default UtterRv;
