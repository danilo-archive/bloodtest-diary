import React, { Component } from 'react';

import LoginForm from './loginComponents/loginForm.js';
import LoginBackgroundAnimation from './loginComponents/loginBackgroundAnimation.js';
import {getServerConnect} from "./../serverConnection.js";
import '../styles/login.css';

class Login extends Component {

  constructor(props){
      super(props);
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
