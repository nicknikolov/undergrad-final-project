import React from 'react'
import ReactPlayer from 'react-player'
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

const VideoPlayer = React.createClass({
  propTypes: {
    playerVolume: React.PropTypes.number,
    playerPlaying: React.PropTypes.bool,
    videoWordsOptions: React.PropTypes.array,
    setPlayerPlayingIndex: React.PropTypes.func,
    setPlayerVolumeUpIndex: React.PropTypes.func,
    setPlayerVolumeDownIndex: React.PropTypes.func
  },

  getInitialState: function () {
    return {}
  },

  setPlayerPlayingIndex: function (event) {
    this.props.setPlayerPlayingIndex(event.target.value)
  },

  setPlayerVolumeUpIndex: function (event) {
    this.props.setPlayerVolumeUpIndex(event.target.value)
  },

  setPlayerVolumeDownIndex: function (index) {
    this.props.setPlayerVolumeDownIndex(event.target.value)
  },

  render: function () {
    return (
      <Panel header={(<h4>Video Player Example </h4>)}>
        <ListGroup>
          <ListGroupItem bsStyle="info">
            In this example, you can teach your own gestures to control this video player.
            Simply map the classes from the your model above to the controls.
          </ListGroupItem>
        </ListGroup>
        <Form inline>
          <FormGroup>
            <ControlLabel>Play/Pause</ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={this.setPlayerPlayingIndex}>
              <option value='--' key={-1}>---</option>
              {this.props.videoWordsOptions}
            </FormControl>
            <ControlLabel>Volume Up</ControlLabel>
            <FormControl componentClass='select'
              placeholder='select'
              onChange={this.setPlayerVolumeUpIndex}>
              <option value='--' key={-1}>---</option>
              {this.props.videoWordsOptions}
            </FormControl>
            <ControlLabel>Volume Down</ControlLabel>
            <FormControl componentClass='select'
              placeholder='select'
              onChange={this.setPlayerVolumeDownIndex}>
              <option value='--' key={-1}>---</option>
              {this.props.videoWordsOptions}
            </FormControl>
          </FormGroup>
        </Form>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=C216ZRVOM5A'
          playing={this.props.playerPlaying}
          volume={this.props.playerVolume}
        />
      </Panel>
    )
  }
})

export default VideoPlayer
