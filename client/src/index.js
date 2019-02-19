import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/login.js';
import Home from './components/home.js';
import * as serviceWorker from './serviceWorker';

import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

const routing = (
  <Router>
    <div className={"routes"}>
      <Route exact path = "/" component = {Login}/>
      <Route path = "/home" component = {Home}/>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service worskers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
