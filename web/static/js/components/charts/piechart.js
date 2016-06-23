import React from 'react';
import {connect} from 'react-redux';
import d3 from 'd3';

import '../../../css/piechart.css';

class d3PieChart {
    /*
     var dataset = [
          { label: 'Abulia', count: 10 }, 
          { label: 'Betelgeuse', count: 20 },
          { label: 'Cantaloupe', count: 30 },
          { label: 'Dijkstra', count: 40 }
        ];
     */
    constructor(el, props) {
        this.el = el;
        this.props = props;
        this.radius = Math.min(this.props.width, this.props.height) / 2;

        this.arc = d3.svg.arc()
            .outerRadius(this.radius * 0.8)
            .innerRadius(this.radius * 0.5);

        this.outerArc = d3.svg.arc()
            .innerRadius(this.radius * 0.9)
            .outerRadius(this.radius * 0.9);

        this.legendRectSize = (this.radius * 0.05);
        this.legendSpacing = this.radius * 0.02;

        this.pie = d3.layout.pie()
            .value(function(d){return d.count;})
            .sort(null);
    }

    create(state) {
        this.svg = d3.select(this.el).append('svg')
            .attr('class', 'PieChart')
            .attr('width', this.props.width)
            .attr('height', this.props.height)
            .append('g');
        this.svg.append('g')
                .attr('class', 'slices');
        this.svg.append('g')
                .attr('class', 'legends');
        this.svg.append('g')
                .attr('class', 'labels');
        this.svg.append('g')
                .attr('class', 'lines');
        this.svg.attr('transform', 'translate(' + (this.props.width / 2) + 
            ',' + (this.props.height / 2) + ')');
        this._draw(state);
    }

    _draw(state) {
        var key = function(d) {
            return d.data.label;
        };
        var color = d3.scale.category20b();
        var arc = this.arc;
        var outerArc = this.outerArc;
        var pie = this.pie;
        var radius = this.radius;
        var legendRectSize = this.legendRectSize
        var legendSpacing = this.legendSpacing;

        //slice 
        var slice = this.svg.select('.slices').selectAll('path.slice')
            .data(pie(state), key);

        slice.enter()
            .insert('path')
            .style('fill', function(d) {return color(d.data.label);})
            .attr('class', 'slice');
        
        slice.transition()
            .duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

        slice.exit()
            .remove();
        
        //legend
        var legends = this.svg.selectAll('.legends').selectAll('.legend')
            .data(pie(state), key)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * state.length / 2;
                var horz = -3 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legends.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d) {return color(d.data.label)})
            .style('stroke', function(d) {color(d.data.label)});

        legends.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d.data.label + ':' + d.data.count; });

/*
        //lable text
        var text = this.svg.select(".labels").selectAll("text")
		.data(pie(state), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
                return d.data.label+":"+d.data.count;
            });
        
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }
        
        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });
        text.exit()
            .remove()
        //line
        var polyline = this.svg.select(".lines").selectAll("polyline")
            .data(pie(state), key);
        
        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });
        
        polyline.exit()
            .remove();
*/
    }

    update() {
    }

    destroy() {
    }
}

class PieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.el = React.findDOMNode(this);
        this.d3PieChart = new d3PieChart(this.el, {
            width: this.props.size.width,
            height: this.props.size.height
        });
        this.d3PieChart.create(this.getChartState());
    }

    componentDidUpdate() {
        this.d3PieChart.update(this.el, this.getChartState());
    }

    componentWillUnmount() {
        this.d3PieChart.destroy(this.el);
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

export default connect(select)(PieChart);
