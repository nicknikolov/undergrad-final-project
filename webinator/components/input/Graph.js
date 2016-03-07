import ReactFauxDOM from 'react-faux-dom'
import React from 'react'
import d3 from 'd3'
import { Button } from 'react-bootstrap'

var Inputs = React.createClass({
  propTypes: {
    inputs: React.PropTypes.array,
    resend: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      selectedIndex: 1
    }
  },

  prev: function () {
    this.setState({ selectedIndex: this.state.selectedIndex + 1 })
  },

  next: function () {
    this.setState({ selectedIndex: this.state.selectedIndex - 1 })
  },

  handleResend: function () {
    this.props.resend(this.props.inputs[this.state.selectedIndex])
  },

  render: function () {
    var m = [10, 10, 25, 45] // margins
    var w = 300 - m[1] - m[3] // width
    var h = 200 - m[0] - m[2] // height
    var selectedDataSet = this.props.inputs[this.props.inputs.length - this.state.selectedIndex]
    var data = [selectedDataSet.data.x, selectedDataSet.data.y, selectedDataSet.data.z]

    var x = d3.scale.linear().domain([0, data[0].length]).range([0, w])
    var y = d3.scale.linear().domain([-7, 7]).range([h, 0])

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(5)

    var yAxisLeft = d3.svg.axis()
      .scale(y)
      .ticks(4)
      .orient('left')

    var line = d3.svg.line()
      .x(function (d, i) { return x(i) })
      .y(function (d) { return y(d) })

    var nodeX = ReactFauxDOM.createElement('svg')
    var nodeY = ReactFauxDOM.createElement('svg')
    var nodeZ = ReactFauxDOM.createElement('svg')
    var nodes = []
    nodes.push(nodeX, nodeY, nodeZ)

    for (var i = 0; i < 3; i++) {
      var svg = d3.select(nodes[i])
        .attr('width', w + m[1] + m[3])
        .attr('height', h + m[0] + m[2])
        .append('g')
        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')')

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis)

      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(-25,0)')
        .call(yAxisLeft)

      svg.append('path').attr('d', line(data[i]))
    }

    var prev = !(this.props.inputs.length - (this.state.selectedIndex + 1) >= 0)
    var next = this.state.selectedIndex === 1
    return (
      <div>
        <h3>Motion Data Graphs</h3>
        <div> { nodes[0].toReact() } </div>
        <div> { nodes[1].toReact() } </div>
        <div> { nodes[2].toReact() } </div>
        <Button bsStyle='primary' disabled={prev} onClick={this.prev}>Prev</Button>
        <Button bsStyle='primary' disabled={next} onClick={this.next}>Next</Button>
        <Button bsStyle='primary' onClick={this.handleResend}>Resend</Button>
      </div>
    )
  }
})

export default Inputs
