import ReactFauxDOM from 'react-faux-dom'
import React from 'react'
import d3 from 'd3'
import { ButtonToolbar, Panel, Row, Col, Button } from 'react-bootstrap'

var Inputs = React.createClass({
  propTypes: {
    inputs: React.PropTypes.array,
    resend: React.PropTypes.func,
    deleteExample: React.PropTypes.func,
    classIndex: React.PropTypes.number
  },

  getInitialState: function () {
    return {
      selectedIndex: 1
    }
  },

  componentWillReceiveProps: function () {
    this.setState({ selectedIndex: 1 })
  },

  prev: function () {
    this.setState({ selectedIndex: this.state.selectedIndex + 1 })
  },

  next: function () {
    this.setState({ selectedIndex: this.state.selectedIndex - 1 })
  },

  handleResend: function () {
    this.props.resend(this.props.inputs[this.props.inputs.length - this.state.selectedIndex])
  },

  deleteExample: function () {
    let currentIndex = this.props.inputs.length - this.state.selectedIndex
    let firstHalf = this.props.inputs.slice(0, currentIndex)
    let secondHalf = this.props.inputs.slice(currentIndex + 1, this.props.inputs.length)
    this.props.deleteExample([...firstHalf, ...secondHalf])
  },

  render: function () {
    var m = [10, 10, 25, 55] // margins
    var w = 300 - m[1] - m[3] // width
    var h = 200 - m[0] - m[2] // height
    var selectedDataSet = this.props.inputs[this.props.inputs.length - this.state.selectedIndex]
    var data = [selectedDataSet.x, selectedDataSet.y, selectedDataSet.z]

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
        <Panel header={(<h4>Motion Data Graphs</h4>)}>
          <ButtonToolbar>
            <Button bsStyle='primary' disabled={prev} onClick={this.prev}>Prev</Button>
            <Button bsStyle='primary' disabled={next} onClick={this.next}>Next</Button>
            <Button bsStyle='primary' onClick={this.handleResend}>Resend</Button>
            <Button bsStyle='danger' onClick={this.deleteExample}>Delete</Button>
          </ButtonToolbar>
          <Row>
            <Col md={5}>{nodes[0].toReact()}</Col>
            <Col md={3}>
              This graph shows you how you moved your device
              <span style={{color: 'red'}}><b> left </b></span> and
              <span style={{color: 'red'}}><b> right</b></span>.
            </Col>
          </Row>
          <Row>
            <Col md={5}>{nodes[1].toReact()}</Col>
            <Col md={3}>
              This graph shows you how you moved your device
              <span style={{color: 'blue'}}><b> up </b></span> and
              <span style={{color: 'blue'}}><b> down</b></span>.
            </Col>
          </Row>
          <Row>
            <Col md={5}>{nodes[2].toReact()}</Col>
            <Col md={3}>
              This graph shows you how you moved your device
              <span style={{color: 'green'}}><b> further away </b></span> and
              <span style={{color: 'green'}}><b> closer to you</b></span>.
            </Col>
          </Row>
        </Panel>
      </div>
    )
  }
})

export default Inputs
