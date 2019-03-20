import React, { Component } from 'react';
import styled from "styled-components";
import { withRouter, Redirect, Link } from 'react-router-dom'

const crypto = require('crypto');

const Container = styled.div`
  border: solid 0px red;
  height: 300px;
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  color: #646464;

  .login_error {
    width: 100%;
    visibility: hidden;
  }

  .icons {
    display: none;
  }




  @keyframes fadeOut {
      0% {
          opacity: 1;
          transform: translate();
      }
      100% {
          opacity: 0;
          transform: translate(0, -70%);
      }
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  height: 50px;
  font-family: "Open Sans", sans-serif;

  margin-bottom: 15px;
`;

const InputSection = styled.div`
  height: 100%;
  width: 100%;
  color: #eee;
  border-radius:  0.25rem;
  background-color: #97a9a9;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;

  padding-left: 15px;

  .loginInput {
    width: 100%;
    height: 100%;
    color: #eee;
  }

  :focus,
  :hover {
    background-color: #abbdbd;
  }
  input::placeholder {
    color: #f2f9f9;
    font-weight: 600;
  }
`;

const Label = styled.div`
  height: 100%;
  width: 70px;
  background-color: #839595;
  border-radius: 0.25rem;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;


  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .loginIcon {
    display: inline-block;
    fill: #f4f9fd;
    font-size: 1rem;
    height: 1em;
    vertical-align: middle;
    width: 1em;
  }
`;

const SubmitButton = styled.div`
    width: 100%
    height: 50px;

    font-family: "Open Sans", sans-serif;

    background-color: #55cdd1;
    color: #eee;
    font-weight: 500;
    text-transform: uppercase;

    border-radius: 0.25rem;
    text-align: center;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;

    &:focus,
    &:hover {
      background-color: #0b989d;
    }
`;

const RecoveryLabel = styled.p`
  width: auto;
  color: #646464;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;

  font-family: "Rajdhani", sans-serif;

  &:hover {
    color: #0b999d;
  }
`;

const ErrorLabel = styled.p`
  color: red;
  margin: 0 auto;
  white-space: nowrap;
  cursor: default;
  text-align: center;

  font-family: "Rajdhani", sans-serif;
`;


class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      wrongPassword: false
    };

    this.serverConnect = props.serverConnect;
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    let credentials = {username: this.state.username, password: crypto.createHash('sha256').update(this.state.password).digest('hex')};
    this.serverConnect.login(credentials, res => {
          if (res.success){
              this.serverConnect.setLoginToken(res.accessToken);
              this.props.history.push("home");
          }else{
              this.showLoginErrorMessage();
          }
    });
    this.clearForm();
    event.preventDefault();
  }

  clearForm() {
    this.setState({
       username: '',
       password: ''
   })
  }

  onRecoverPassword = () => {
      this.props.onResetPassword();
  }

  showLoginErrorMessage = () => {
      this.setState({wrongPassword: true})
      setTimeout( () => {
          this.setState({wrongPassword: false})
      }, 5000);
  }


  render(){
    return (
      <Container>
        <Section>
          <Label><svg className="loginIcon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#user"/></svg></Label>
          <InputSection>
            <input id="login__username" type="text" name="username" className="loginInput" value={this.state.username} onChange={this.handleChange} placeholder="Username" required/>
          </InputSection>
        </Section>

        <Section>
          <Label><svg className="loginIcon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#lock"/></svg></Label>
          <InputSection>
            <input type="password" name="password" className="loginInput" value={this.state.password} onChange={this.handleChange} placeholder="Password" required/>
          </InputSection>
        </Section>

        <SubmitButton onClick={this.handleSubmit}>Sign In</SubmitButton>

        <RecoveryLabel onClick={this.onRecoverPassword}>Recover Password</RecoveryLabel>

        <ErrorLabel className={this.state.wrongPassword ? null : 'hidden'}>Username or password is invalid</ErrorLabel>

        <svg xmlns="http://www.w3.org/2000/svg" className="icons"><symbol id="arrow-right" viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"/></symbol><symbol id="lock" viewBox="0 0 1792 1792"><path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z"/></symbol><symbol id="user" viewBox="0 0 1792 1792"><path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z"/></symbol></svg>
      </Container>
    )
  }
}

export default withRouter(LoginForm);
