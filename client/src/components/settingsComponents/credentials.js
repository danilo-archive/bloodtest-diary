import React, { Component } from 'react';
import styled from "styled-components";
import {getServerConnect} from "../../serverConnection.js";
import Select from 'react-select';
import InfoMessage from './infoMessage';
import refresh from "../../resources/images/refresh.png"
import { openAlert } from '../Alert.js';

const crypto = require('crypto');

const Container = styled.div`
  height: auto;
  width: 100%;
  padding-bottom: 10px;
  background: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  color: #646464;

  .credentialsTitle {
    margin: 15px;
    margin-bottom: 0px;
    font-size: 140%;
  }

  .inputSection {

    width: 90%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    border: solid 1px #b3b3b3;
    border-radius: 5px;

    padding-top: 8px;
    padding-bottom: 8px;
    margin-top: 8px;
    margin-bottom: 8px;

    :placeholder {

    }
  }

  .usersLabel {
    width: auto;
    font-size: 110%;
    margin-right: 8px;
    margin-left: 8px;
    color: #646464;
    white-space: nowrap;
  }

  .usersInput {
    width: 100%;
    font-size: 120%;
    color: #0b999d;
  }

  .inputSection:focus-within {
    box-shadow: 0 0 2px #0b999d;
  }

  .hidden {
    visibility: hidden;
  }

  .saveButton {
    border: none;
    background-color: #0b999d;
    color: #eee;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;

    height: 40px;
    min-width: 120px;

    :hover {
      background-color: #018589;
      color: #eee;
    }
    outline: none;
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  width: 90%;
  margin-top:10px;
  margin-bottom:15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CancelButton = styled.button`
  border: none;
  background-color: #e7e7e7;
  color: black;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  height: 40px;
  min-width: 120px;

  :hover {
    background: #c8c8c8;
    color: black;
  }
  outline: none;
  cursor: pointer;
`;


export default class Credentials extends Component {

  constructor(props){
      super(props);
      this.state = {
         username: "",
         email: "",
         password: "",
         confirmPassword: "",

         showErrorMessage: false,
         showConfirmationMessage: false,
      };
      this.serverConnect = getServerConnect();
      this.init();
  }

  init = () => {
    this.serverConnect.getCurrentUser( res => {
      console.log(res);
      if (res.success){
        this.setState({ username: res.response[0].username, email: res.response[0].recovery_email});
      }
    });
  }


  handleCredentialUpdate = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onSaveEditUser = (event) => {
    event.preventDefault();
    this.serverConnect.requestUserEditing(this.state.username, res => {
      if (res.success){
          if (this.state.password == this.state.confirmPassword && this.state.password !== "") {
            let hash = crypto.createHash('sha256').update(this.state.password).digest('hex');
            let newData = {username: this.state.username, hashed_password: hash, recovery_email: this.state.email};
            this.updateDatabase(newData, res.token);
          } else if (this.state.password === "" && this.state.confirmPassword === "") {
              let newData = {username: this.state.username, recovery_email: this.state.email};
              this.updateDatabase(newData, res.token);
          } else {
            this.serverConnect.discardUserEditing(this.state.username, res.token, res => {
              this.setState({
                password: "",
                confirmPassword: "",
              })
              this.showErrorMessage();
            });
          }
      }else{
        openAlert("Somebody is editing this user already", "confirmationAlert",
                   "Ok", () => {return});
      }
    });

  }

  updateDatabase(newData, token) {
    this.serverConnect.editUser(newData, token, res => {
      if (res.success){
        this.showConfirmationMessage();
      }else{
        openAlert("Something went wrong", "confirmationAlert",
                   "Ok", () => {return});
      }
    });
    this.clearForm();
  }


  clearForm = () => {
     this.setState({
       password: "",
       confirmPassword: "",
     });
  }

 showErrorMessage = () => {
     this.setState({showErrorMessage: true})
     setTimeout( () => {
         this.setState({showErrorMessage: false})
     }, 3000);
 }

 showConfirmationMessage = () => {
     this.setState({showConfirmationMessage: true})
     setTimeout( () => {
         this.setState({showConfirmationMessage: false})
     }, 3000);
 }

  render(){
    return (
      <Container>

        <p className="credentialsTitle">My Credentials</p>

        <InfoMessage className={""} message={"Database Updated Successfully" } show={this.state.showConfirmationMessage}/>
        <>
            <form onSubmit={this.onSaveEditUser} style={{ display: "flex",   "flex-direction": "column", "justify-content": "center", "align-items": "center"}}>
              <div className="inputSection">
                <div className="usersLabel">Email:</div>
                <input id="emailInput" type="text" name="email" className="usersInput" value={this.state.email} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">New Password:</div>
                <input id="passwordInput" type="password" name="password" className="usersInput" value={this.state.password} onChange={this.handleCredentialUpdate} placeholder="Optional"/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Confirm Password:</div>
                <input id="confrimPasswordInput" type="password" name="confirmPassword" className="usersInput" value={this.state.confirmPassword} onChange={this.handleCredentialUpdate} placeholder="Optional"/>
              </div>
              <InfoMessage type={"error"} message={"Passwords Don't Match"} show={this.state.showErrorMessage}/>
              <ButtonContainer>
                  <CancelButton type="button" onClick={this.clearForm}>Cancel</CancelButton>
                  <input type="submit" className="saveButton" value="Save"></input>
              </ButtonContainer>
              </form>

          </>
      </Container>
    )
  }
}
