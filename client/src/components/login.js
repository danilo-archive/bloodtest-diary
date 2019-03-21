import React, { Component } from 'react';
import styled from "styled-components";


import LoginForm from './loginComponents/loginForm.js';
import ResetPassword from './loginComponents/resetPassword.js';
import LoginBackgroundAnimation from './loginComponents/loginBackgroundAnimation.js';
import {getServerConnect} from "./../serverConnection.js";
import '../styles/global.css';

const Container = styled.div`
  height: calc(100vh - 28px);
  width: auto;
  position: relative;
  top: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  @keyframes opac {
      0% {
          opacity: 0;
      }
      100% {
          opacity: 1;
      }
  }
`;
class Login extends Component {

  constructor(props){
      super(props);

      this.state = {
        loginState: true
      }

      this.serverConnect = getServerConnect();
      this.serverConnect.joinLoginPage();
  }

  changeForm = () => {
    if (this.state.loginState) {
      this.setState({ loginState: false})
    } else {
      this.setState({ loginState: true})
    }
  }

  render() {
    return (
      <Container>
        {this.state.loginState ?
          <LoginForm serverConnect={this.serverConnect} onResetPassword={this.changeForm}/>
        :
          <ResetPassword serverConnect={this.serverConnect} onCancel={this.changeForm}/>
        }
        <LoginBackgroundAnimation />
      </Container>
    );
  }
}

export default Login;
