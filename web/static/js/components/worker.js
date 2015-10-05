import React from 'react';

class Worker extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
	}

	handleSelect(key){
	}

    render(){
        return (
            <div>
                <iframe width="500px" height="850px" src="http://10.21.133.28:12345/"></iframe>
                <iframe width="500px" height="850px" src="http://10.50.100.188:12345/"></iframe>
                <iframe width="500px" height="850px" src="http://10.50.100.100:12345/"></iframe>
            </div>
        )
    }
}

export default Worker;