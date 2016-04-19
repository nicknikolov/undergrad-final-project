import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import configureStore from './store/configureStore'
import App from './components/App'
import Mobile from './components/Mobile'

let store = configureStore()

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}/>
      <Route path='/mobile' component={Mobile}/>
    </Router>
  </Provider>,
  document.querySelector('#content')
)
