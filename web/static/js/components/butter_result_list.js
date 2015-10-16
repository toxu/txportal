import React from 'react';
import ButterRv from './butter_result';

class ButterResultList extends React.Component{
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
                        <ButterRv key={key} content={rv} />
                );
            }
        );
        return (
                <div className="butter-result-list">
                {urvs}
                </div>
        );
    }
}

export default ButterResultList;
