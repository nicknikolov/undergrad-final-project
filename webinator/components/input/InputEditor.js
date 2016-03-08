import React from 'react'
import { Input } from 'react-bootstrap'

var InputEditor = React.createClass({
  propTypes: {
    rules: React.PropTypes.object,
    setRules: React.PropTypes.func

  },

  handleCheckbox: function (coord, event) {
    this.props.setRules(coord)
  },

  render: function () {
    return (
      <div>
        <Input type='checkbox' label='X' checked={this.props.rules.x} onChange={this.handleCheckbox.bind(this, 'x')}/>
        <Input type='checkbox' label='Y' checked={this.props.rules.y} onChange={this.handleCheckbox.bind(this, 'y')}/>
        <Input type='checkbox' label='Z' checked={this.props.rules.z} onChange={this.handleCheckbox.bind(this, 'z')}/>
      </div>
    )
  }
})

export default InputEditor
