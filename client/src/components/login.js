import React, { Component } from 'react';

import LoginForm from './loginComponents/loginForm.js';
import LoginBackgroundAnimation from './loginComponents/loginBackgroundAnimation.js';
import {getServerConnect} from "./../serverConnection.js";
import './login.css';


class Login extends Component {

  constructor(){
      super();
      this.serverConnect = getServerConnect();
      this.serverConnect.joinLoginPage();
  }

  render() {
    return (

      <div className={"login"}>
        <LoginForm serverConnect={this.serverConnect} />
        <LoginBackgroundAnimation />
      </div>
    );
  }
}

export default Login;
