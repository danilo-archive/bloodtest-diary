import React, { Component } from 'react';

import Header from './header.js';
import LoginForm from './loginComponents/loginForm.js';
import LoginBackgroundAnimation from './loginComponents/loginBackgroundAnimation.js';
import {getServerConnect} from "./../serverConnection.js";
import './login.css';


class Login extends Component {

  constructor(){
      super();
      this.serverConnect = getServerConnect();
  }

  render() {
    return (

      <div className={"login"}>
        <Header />
        <LoginForm serverConnect={this.serverConnect} />
        <LoginBackgroundAnimation />
      </div>
    );
  }
}

export default Login;
