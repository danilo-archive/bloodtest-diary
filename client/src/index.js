<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import Login from "./components/login";
import * as serviceWorker from "./serviceWorker";
=======
import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/login.js';
import Home from './components/home.js';
import * as serviceWorker from './serviceWorker';
>>>>>>> 148e1ba24088907d0f1e16bc9d2b2d0bf8049597

import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";

const routing = (
  <Router>
<<<<<<< HEAD
    <Route path="/" component={App} />
=======
    <div>
      <Route exact path = "/" component = {Login}/>
      <Route path = "/home" component = {Home}/>
    </div>
>>>>>>> 148e1ba24088907d0f1e16bc9d2b2d0bf8049597
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service worskers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
