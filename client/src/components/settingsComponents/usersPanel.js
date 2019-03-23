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

  .userTitle {
    margin: 15px;
    margin-bottom: 10px;
    font-size: 140%;
  }

  .userSelect {
    font-size: 120%;
    width: 75%;
    margin: 0;
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

  .addUser {
    border: 2px solid transparent;
    background-color: #0b999d;
    color: #eee;
    font-size: 120%;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;

    margin-right: 10px;

    height: 33.5px;
    min-width: 70px;
    width: 70px;
    max-width: 70px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    :hover {
      color: #eee;
      border: 2px solid transparent;
      background-color: #018589;
    }
    outline: none;
    cursor: pointer;
  }

  .disabled {
    border: 2px solid #ddd;
    background-color: #d5d5d5;
    color: #646464;
    font-size: 120%;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;

    margin-right: 10px;

    height: 34.5px;
    min-width: 70px;
    width: 70px;
    max-width: 70px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    outline: none;
  }

  .inputDisabled {
    border: solid 1px #b3b3b3;
    background-color: rgb(235, 235, 228);
    color: #646464;
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

const MenuContainer = styled.div`
  width: 90%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

const AdminCheckContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 20px;

  .adminLabel {
    white-space: nowrap;
    cursor: default;
    font-size: 110%;
    margin: 0;
    margin-top: 2px;
    margin-right: 35px;
  }
`;

const AdminCheck = styled.input.attrs({ type: "checkbox" })`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  appearance: none;
  outline: none;
  border: solid 3px #646464;
  padding: 0;
  transition: 100ms;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background: #0b999d;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0;
    transition: 100ms;
  }
  &:checked {
    border: solid 3px #0b999d;
  }

  &:checked::before {
    opacity: 1;
  }
`;

const RefreshButton = styled.div`
    background-color: #0b999d;
    height: 36px;
    width: 50px;
    border-radius: 20%;
    margin-left: 10px;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :hover {
      background-color: #018589;
    }

    .refreshIcon {
    width: 60%;
    height: 60%;
    }
`;

const colourStyles = {
  control: (styles, { data, isDisabled, isFocused, isSelected }) => ({ ...styles, backgroundColor: isDisabled ? '#ddd' : 'white', cursor: 'text'}),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? isSelected ? '#c8c8c8' :  '#eee' : 'white',
    };
  },
  input: (styles, { data, isDisabled, isFocused, isSelected }) => ({ ...styles,}),
  placeholder: (styles, { data, isDisabled, isFocused, isSelected }) => ({ ...styles, color: '#646464'}),
  singleValue: (styles, { data, isDisabled, isFocused, isSelected }) => ({ ...styles, color: '#646464'}),
};

export default class UsersPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
         allUsers: undefined,
         selectedOption: null,
         editToken: undefined,
         newUserState: false,
         disabled: false,
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
         adminChecked: false,

         showErrorMessage: false,
         showConfirmationMessage: false,
         showReloadMessage: false,
      };
      this.serverConnect = getServerConnect();
      this.getUsers();
      this.getCurrentUserUsername();
  }

  getUsers() {
    this.serverConnect.getAllUsers(res => {
      if (res.success){
        let otherUsers = res.response.filter(user => ( user.username !== this.state.currUsername));
        let users = otherUsers.map(user => ({
          label: user.username,
          value: user.recovery_email,
          isAdmin: user.isAdmin === "yes"
        }));
        this.setState({allUsers: users});
      }else{
        //TODO error check
      }
    });
  }

  getCurrentUserUsername() {
    this.serverConnect.getCurrentUser( res => {
      if (res.success){
        this.setState({
            currUsername: res.response[0].username
        });
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

  handleSelectChange = (selectedOption) => {
    if (this.state.disabled) {
      return
    } else {
      this.serverConnect.requestUserEditing(selectedOption.label, res => {
        if (res.success){
          this.setState({selectedOption , username: selectedOption.label, editToken: res.token, disabled: true, email: selectedOption.value, adminChecked: selectedOption.isAdmin});
        }else{
          openAlert("Somebody is already editing this user.", "confirmationAlert",
          "OK", () => {return});
        }
      });

   }
 }

 onAddUser = (selectedOption) => {
   if (this.state.disabled) {
     return
   } else {
     this.setState({newUserState: true, disabled: true});
   }
  }

 onSaveEditUser = (event) => {
   event.preventDefault();
   if (this.state.password == this.state.confirmPassword && this.state.password !== "") {
     let hash = crypto.createHash('sha256').update(this.state.password).digest('hex');
     let newData = {username: this.state.username, hashed_password: hash, isAdmin: this.state.adminChecked ? "yes" : "no", recovery_email: this.state.email};
     this.updateDatabase(newData);
  } else if (this.state.password === "" && this.state.confirmPassword === "") {
       let newData = {username: this.state.username, isAdmin: this.state.adminChecked ? "yes" : "no", recovery_email: this.state.email};
       this.updateDatabase(newData);
   } else {
     this.setState({
       password: "",
       confirmPassword: "",
     })
     this.showErrorMessage();
   }

 }

 updateDatabase(newData) {
   this.serverConnect.editUser(newData, this.state.editToken, res => {
     if (res.success){
      this.clearForm();
      this.showConfirmationMessage();
      this.getUsers();
     }else{
      openAlert("Something went wrong.", "confirmationAlert",
                 "OK", () => {return});
     }
   });
 }

 onSaveAddUser = (event) => {
   event.preventDefault();
   if (this.state.password === this.state.confirmPassword) {
       let hash = crypto.createHash('sha256').update(this.state.password).digest('hex');
       let user = {username: this.state.username, hashed_password: hash, isAdmin: "no", recovery_email: this.state.email};
       this.serverConnect.addUser(user, res => {
          if (res.success){
            this.clearForm();
            this.showConfirmationMessage();
            this.getUsers();
          }else{
            openAlert("Something went wrong, make sure username is not already used.", "confirmationAlert",
                       "OK", () => {return});
          }
       });
   } else {
     this.setState({
       password: "",
       confirmPassword: "",
     })
     this.showErrorMessage();
   }
 }

  clearForm = () => {
    this.serverConnect.discardUserEditing(this.state.username, this.state.editToken, res => {
     this.setState({
       selectedOption: null,
       editToken: undefined,
       disabled: false,
       newUserState: false,
       username: "",
       email: "",
       password: "",
       confirmPassword: "",
       adminChecked: false,
     });
    });
  }

 onAdminCheck = () => {
   if (this.state.adminChecked) {
     this.setState({adminChecked: false});
   } else {
     this.setState({adminChecked: true});
   }
  }

 updateUsers = () => {
   this.getUsers();
   this.showReloadMessage();
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

 showReloadMessage = () => {
     this.setState({showReloadMessage: true})
     setTimeout( () => {
         this.setState({showReloadMessage: false})
     }, 3000);
 }

  render(){
    return (
      <Container>

        <p className="userTitle">User management</p>

        <MenuContainer>
          <div className={this.state.disabled ? 'disabled' : 'addUser'} onClick={this.onAddUser}>Add user</div>

          <Select
            className="userSelect"
            styles={colourStyles}
            placeholder="Edit User..."
            value={this.state.selectedOption}
            options={this.state.allUsers}
            onChange={this.handleSelectChange}
            isDisabled={this.state.disabled}

            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              border: 1,
              colors: {
              ...theme.colors,
                primary: '#ddd',
                primary50: '#ddd',
              },
            })}
          />

          <RefreshButton onClick={this.updateUsers} title="Reload Users">
             <img className={"refreshIcon"} src={refresh} alt={"Refresh Button"}/>
          </RefreshButton>
        </MenuContainer>

        <InfoMessage className={""} message={this.state.showReloadMessage ?  "Reloading completed." : "Database updated successfully." } show={this.state.showReloadMessage || this.state.showConfirmationMessage}/>

        {this.state.selectedOption ?
          <>
            <form onSubmit={this.onSaveEditUser} style={{ display: "flex",   "flex-direction": "column", "justify-content": "center", "align-items": "center"}}>
              <div className="inputSection inputDisabled">
                <div className="usersLabel">Username:</div>
                <input id="usernameInput" type="text" name="username" className="usersInput" value={this.state.username} onChange={this.handleCredentialUpdate} disabled/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Email:</div>
                <input id="emailInput" type="text" name="email" className="usersInput" value={this.state.email} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">New password:</div>
                <input id="passwordInput" type="password" name="password" className="usersInput" value={this.state.password} onChange={this.handleCredentialUpdate} placeholder="(optional)"/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Confirm password:</div>
                <input id="confrimPasswordInput" type="password" name="confirmPassword" className="usersInput" value={this.state.confirmPassword} onChange={this.handleCredentialUpdate} placeholder="(optional)"/>
              </div>
              <AdminCheckContainer>
                <p className="adminLabel">Administrator:</p>
                <AdminCheck
                  checked={this.state.adminChecked}
                  onClick={this.onAdminCheck}
                />
              </AdminCheckContainer>
              <InfoMessage type={"error"} message={"Passwords Don't Match"} show={this.state.showErrorMessage}/>
              <ButtonContainer>
                  <CancelButton type="button" onClick={this.clearForm}>Cancel</CancelButton>
                  <input type="submit" className="saveButton" value="Save"/>
              </ButtonContainer>
            </form>
          </>
        :
          <>
          </>
        }

        {this.state.newUserState ?
          <>
            <form onSubmit={this.onSaveAddUser} style={{ display: "flex",   "flex-direction": "column", "justify-content": "center", "align-items": "center"}}>
              <div className="inputSection">
                <div className="usersLabel">Username:</div>
                <input id="usernameInput" type="text" name="username" className="usersInput" value={this.state.username} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Email:</div>
                <input id="emailInput" type="text" name="email" className="usersInput" value={this.state.email} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">New password:</div>
                <input id="passwordInput" type="password" name="password" className="usersInput" value={this.state.password} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Confirm password:</div>
                <input id="confrimPasswordInput" type="password" name="confirmPassword" className="usersInput" value={this.state.confirmPassword} onChange={this.handleCredentialUpdate} required/>
              </div>
              <InfoMessage type={"error"} message={"Passwords must match!"} show={this.state.showErrorMessage}/>
              <ButtonContainer>
                  <CancelButton type="button" onClick={this.clearForm}>Cancel</CancelButton>
                  <input type="submit" className="saveButton" value="Save"/>
              </ButtonContainer>
            </form>
          </>
        :
          <>
          </>
        }
      </Container>
    )
  }
}
