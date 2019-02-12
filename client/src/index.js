import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import Login from './components/login';
import * as serviceWorker from './serviceWorker';

import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

const routing = (
  <Router>
    <Route path = "/" component = {App}>

    </Route>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service worskers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
