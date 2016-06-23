import React from 'react';
import {connect} from 'react-redux';
import d3 from 'd3';

import '../../../css/barchart.css';

class d3BarChart {
    constructor(el, props) {
        this.el = el;
        this.props = props;
        this.domain = props.domain;
        this.barHeight = 20;
    }

    create(state) {
        this.svg = d3.select(this.el).append('svg')
            .attr('class', 'BarChart')
            .attr('width', this.props.width)
            .attr('height', this.props.height);
        this.svg.append('g')
            .attr('class', 'bars');
        this._draw(state);
    }

    _draw(state) {
        var scales = this._scales();
        var barHeight = this.barHeight;
        var bars = this.svg.select('.bars');
        bars.selectAll('*').remove();
        var bar = bars.selectAll('.bar')
            .data(state);

        bar.enter()
            .append('g')
            .attr('class', '.bar')
            .attr('transform', function(d, i) {return "translate(0,"+i*barHeight+")";});

        var rect = bar.selectAll('rect');
        var text = bar.selectAll('text');
        rect.remove();
        text.remove();
        bar.append('rect')
            .attr('width', function(d) {return scales.x(d.x);})
            .attr('height', barHeight-1);
        bar.append('text')
            .attr('x', function(d) {return scales.x(d.x)-3;})
            .attr('y', barHeight / 2)
            .attr('dy', '.35em')
            .text(function(d) {return d.id + ":" + d.x});
    }

    _scales() {
        if (!this.domain) {
            return null;
        }

        var width = this.el.offsetWidth;
        var height = this.el.offsetHeight;

        var x = d3.scale.linear()
            .range([40, width])
            .domain(this.domain.x);
        return {x: x};
    }

    update(state) {
        console.log(state);
        this._draw(state);
    }

    destroy() {
    }
}

class BarChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.el = React.findDOMNode(this);
        this.d3BarChart = new d3BarChart(this.el, {
            width: this.props.size.width,
            height: this.props.size.height,
            domain: this.props.domain
        });
        this.d3BarChart.create(this.getChartState());
    }

    componentDidUpdate() {
        this.el = React.findDOMNode(this);
        this.d3BarChart.update(this.getChartState());
    }

    componentWillUnmount() {
        this.d3BarChart.destroy(this.el);
    }

    getChartState() {
        return this.props.data;
       
    }

    render() {
        return (
            <div></div>
        );
    }
}

function select(state) {
    return state.tags;
}

export default connect(select)(BarChart);
