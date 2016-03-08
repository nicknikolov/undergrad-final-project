import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Graph from '../../containers/input/Graph'
import InputEditor from './InputEditor.js'

var Inputs = React.createClass({
  propTypes: {
    resend: React.PropTypes.func,
    rules: React.PropTypes.object,
    setRules: React.PropTypes.func
  },

  render: function () {
    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title='Graphs'>
          <Graph
            resend={this.props.resend}
          />
        </Tab>
        <Tab eventKey={2} title='Editor'>
          <InputEditor
            rules={this.props.rules}
            setRules={this.props.setRules}
          />
        </Tab>
      </Tabs>
    )
  }
})

export default Inputs
