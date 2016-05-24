import React from 'react'
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Row,
  Panel,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Grid,
  OverlayTrigger,
  Popover,
  Input } from 'react-bootstrap'

const Dashboard = React.createClass({
  propTypes: {
    prediction: React.PropTypes.string,
    flipBulkMode: React.PropTypes.func,
    bulkMode: React.PropTypes.bool,
    isRecording: React.PropTypes.bool,
    addClass: React.PropTypes.func,
    setExampleForVisualisation: React.PropTypes.func,
    incomingExamples: React.PropTypes.array,
    clearIncomingExamples: React.PropTypes.func
  },

  render: function () {
    return (
      <Panel header={(<h4>Dashboard</h4>)}>
        <Row>
          <Col md={3}>
            <b>New Example: </b>
            <Button
              id='prediction'
              bsStyle='link'
              onClick={this.props.setExampleForVisualisation}>
              {this.props.prediction}
            </Button>
            {this.props.bulkMode && this.props.incomingExamples.length > 1
              ? ' and ' + (this.props.incomingExamples.length - 1).toString() + ' more' : ''}
            </Col>
            <Col md={2}>
              {this.props.isRecording ? 'Recording...' : ''}
            </Col>
            <Col md={2}>
              <Button bsStyle='default' onClick={this.props.addClass}>Add as new class</Button>
            </Col>
            <Col md={1}>
              <Button bsStyle='danger' onClick={this.props.clearIncomingExamples}>
                Clear
              </Button>
            </Col>
            <Col md={2}>
              <b>Bulk mode: </b>
              <Button bsStyle='default' onClick={this.props.flipBulkMode}>
                {this.props.bulkMode ? 'on' : 'off'}
              </Button>
            </Col>
          </Row>
        </Panel>
    )
  }
})

export default Dashboard
