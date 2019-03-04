import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/login.js";
import Home from "./components/home.js";
import Header from "./components/header.js";
import * as serviceWorker from "./serviceWorker";

import styled from "styled-components";

import App from "./components/App";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";

const Offline = styled.div`
  background-color: 'black';
`;

const routing = (
  <Router>
    <div className={"routes"}>
      <Route path="/" component={Header} />
      <Offline>
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
      </Offline>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service worskers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
