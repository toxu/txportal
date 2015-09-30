import React from 'react';
import UtterRv from './utter_result';

class UtterResultList extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { rvlist } = this.props;
        var key = 0;
        var urvs = rvlist.map(
            (rv) => {
                key++;
                return (
                        <UtterRv key={key} content={rv} />
                );
            }
        );
        return (
                <div className="utter-result-list">
                {urvs}
                </div>
        );
    }
}

export default UtterResultList;
