import './polyfill'
import React, { createElement as $ } from 'react'
import { render } from 'react-dom'
import { Router, match, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import withScroll from 'scroll-behavior'
import cookies from 'browser-cookies'

import routes from './routes'
import configureStore from './store/configure'
import reducer from './reducers/combined'

import { setToken } from './actions/token'
import { configureHttp } from './lib/http'

import './styles/global.css'

const rootDom = document.getElementById('app')
const initialState = window.__initial_state__ || {}
const store = configureStore(initialState)
const history = withScroll(browserHistory)

const apiRoot = /localhost/.test(window.location.hostname)
  ? '//localhost:3000'
  : `//api.${window.location.hostname}`
configureHttp(store.getState, apiRoot)

const token = cookies.get('token')
if (token) {
  store.dispatch(setToken(token))
}


match({ routes, history }, (error, redirectLocation, renderProps) => {
  render((
    <Provider store={store}>
      <Router {...renderProps} />
    </Provider>
  ), rootDom)
})
