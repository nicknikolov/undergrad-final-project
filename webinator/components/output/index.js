import React from 'react'
import { Row, Tabs, Tab } from 'react-bootstrap'
import Generator from './Generator'
import Run from './Run'
import Model from '../../containers/output/Model'
import KNN from 'ml-knn'

var Inputs = React.createClass({
  propTypes: {
    setIsRunning: React.PropTypes.func,
    isRunning: React.PropTypes.bool,
    setSelectedClass: React.PropTypes.func,
    dataForPrediction: React.PropTypes.array
  },

  getInitialState: function () {
    return {
      numberOfClasses: 0,
      model: {},
      words: []
    }
  },

  setNumberOfClasses: function (n) {
    this.setState({ numberOfClasses: n })
  },

  createModel: function (cases, labels) {
    var knn = new KNN()

    knn.train(cases, labels, { k: 1 })
    this.setState({ model: knn })
  },

  setWords: function (words) {
    this.setState({words: words})
  },

  render: function () {
    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title='Train'>
          <Row><Generator setNumberOfClasses={this.setNumberOfClasses}/></Row>
          <Row>
            <Model
              numberOfClasses={this.state.numberOfClasses}
              createModel={this.createModel}
              setWords={this.setWords}
              setSelectedClass={this.props.setSelectedClass}
            />
          </Row>
        </Tab>
        <Tab eventKey={2} title='Run'>
          <Run
            model={this.state.model}
            words={this.state.words}
            setIsRunning={this.props.setIsRunning}
            isRunning={this.props.isRunning}
            dataForPrediction={this.props.dataForPrediction}
          />
        </Tab>
      </Tabs>
    )
  }
})

export default Inputs
