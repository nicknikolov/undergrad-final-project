import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Graph from '../../containers/input/Graph'

var Inputs = React.createClass({
  propTypes: {
    resend: React.PropTypes.func
  },

  render: function () {
    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title='Graphs'>
          <Graph
            resend={this.props.resend}
          />
        </Tab>
      </Tabs>
    )
  }
})

export default Inputs
