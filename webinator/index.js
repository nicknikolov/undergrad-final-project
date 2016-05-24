import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import App from './components/App'
import Mobile from './components/Mobile'

render(
  <Router history={hashHistory}>
    <Route path='/' component={App}/>
    <Route path='/mobile' component={Mobile}/>
  </Router>,
  document.querySelector('#content')
)
