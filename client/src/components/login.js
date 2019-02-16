import React, { Component } from 'react';

import Header from './header.js';
import LoginForm from './loginComponents/loginForm.js';
import LoginBackgroundAnimation from './loginComponents/loginBackgroundAnimation.js';

import './login.css';

class Login extends Component {
  render() {
    return (
      <div className={"login"}>
        <Header />
        <LoginForm />
        <LoginBackgroundAnimation />
      </div>
    );
  }
}

export default Login;
