import React, { Component } from 'react';
import styled from "styled-components";

import Select from 'react-select';

const Container = styled.div`
  height: auto;
  width: 100%;
  padding-bottom: 20px;
  background: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  font-family: "Rajdhani", sans-serif;
  color: #646464;

  .userTitle {
    margin: 15px;
    margin-bottom: 5px;
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

  .disabled {
    border: 1px solid #999999;
    background-color: #e7e7e7;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;
    font-size: 120%;
    margin-right: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    height: 38px;
    min-width: 70px;
    outline: none;
  }

  .addUser {
    border: 1px solid transparent;
    background-color: #0b999d;
    color: #eee;
    font-size: 120%;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;

    margin-right: 10px;

    height: 37px;
    min-width: 70px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    :hover {
      background-color: #018589;
      color: #eee;
    }
    outline: none;
    cursor: pointer;
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
  }

`;

const MenuContainer = styled.div`
  width: 90%;
  margin-top: 5px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 90%;
  margin-top:10px;
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
`;

const ErrorLabel = styled.p`
  color: red;
  margin: 0 auto;
  white-space: nowrap;
  cursor: default;
  text-align: center;

  font-family: "Rajdhani", sans-serif;
  animation: opac 1s linear 1;
`;


const users = [
  { label: "Jonny Boy", value: 1 },
  { label: "John Snow", value: 2 },
  { label: "Sansa Stark", value: 3 },
  { label: "Little Finger", value: 4 },
  { label: "The Mountain", value: 5 },
  { label: "Sam", value: 6 },
];

//someArrayOfStrings.map(opt => ({ label: opt, value: opt }));

export default class UsersPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
         selectedOption: null,
         disabled: false,
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
         passwordMatch: true
      };

  }

  handleCredentialUpdate = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleChange = (selectedOption) => {
   this.setState({ selectedOption });
   this.setState({disabled: true});
 }

 onAddUser = (selectedOption) => {
   if (this.state.disabled) {
     return
   } else {
     this.setState({newUser: true, disabled: true});
   }
  }

 clearForm = () => {
   this.setState({
     selectedOption: null,
     newUser: false,
     disabled: false,
     username: "",
     email: "",
     password: "",
     confirmPassword: "",
     passwordMatch: true
  })
 }

 onSaveEditUser = (event) => {
   if (this.state.password == this.state.confirmPassword) {
     //Update Database with new email and password
     this.clearForm()
   } else {
     this.setState({
       password: "",
       confirmPassword: "",
       passwordMatch: false
     })
     setTimeout( () => {
         this.setState({passwordMatch: true})
     }, 5000);
   }
   event.preventDefault();

 }

 onSaveAddUser = (event) => {
   if (this.state.password == this.state.confirmPassword) {
     //Update Database with new user Details, username, email, password
     this.clearForm()
   } else {
     this.setState({
       password: "",
       confirmPassword: "",
       passwordMatch: false
     })
     setTimeout( () => {
         this.setState({passwordMatch: true})
     }, 5000);
   }
   event.preventDefault();

 }


  render(){
    return (
      <Container>

        <p className="userTitle">Users</p>

        <MenuContainer>
          <div className={this.state.disabled ? 'disabled' : 'addUser'} onClick={this.onAddUser}>Add User</div>

          <Select
            className="userSelect"
            placeholder="Edit User..."
            value={this.state.selectedOption}
            options={users}
            onChange={this.handleChange}
            isDisabled={this.state.disabled}
          />
        </MenuContainer>

        {this.state.selectedOption ?
          <>
            <form onSubmit={this.onSaveEditUser} style={{display: "flex",   "flex-direction": "column", "justify-content": "center", "align-items": "center"}}>
              <div className="inputSection">
                <div className="usersLabel">Email:</div>
                <input id="emailInput" type="text" name="email" className="usersInput" value={this.state.email} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">New Password:</div>
                <input id="passwordInput" type="password" name="password" className="usersInput" value={this.state.password} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Confirm Password:</div>
                <input id="confrimPasswordInput" type="password" name="confirmPassword" className="usersInput" value={this.state.confirmPassword} onChange={this.handleCredentialUpdate} required/>
              </div>
              <ErrorLabel className={this.state.passwordMatch ? 'hidden' : null}>Passwords Don't Match</ErrorLabel>
              <ButtonContainer>
                  <CancelButton onClick={this.clearForm}>Cancel</CancelButton>
                  <input type="submit" className="saveButton" value="Save"/>
              </ButtonContainer>
            </form>
          </>
        :
          <>
          </>
        }

        {this.state.newUser ?
          <>
            <form onSubmit={this.onSaveAddUser} style={{display: "flex",   "flex-direction": "column", "justify-content": "center", "align-items": "center"}}>
            <div className="inputSection">
              <div className="usersLabel">Username:</div>
              <input id="usernameInput" type="text" name="username" className="usersInput" value={this.state.username} onChange={this.handleCredentialUpdate} required/>
            </div>
              <div className="inputSection">
                <div className="usersLabel">Email:</div>
                <input id="emailInput" type="text" name="email" className="usersInput" value={this.state.email} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">New Password:</div>
                <input id="passwordInput" type="password" name="password" className="usersInput" value={this.state.password} onChange={this.handleCredentialUpdate} required/>
              </div>
              <div className="inputSection">
                <div className="usersLabel">Confirm Password:</div>
                <input id="confrimPasswordInput" type="password" name="confirmPassword" className="usersInput" value={this.state.confirmPassword} onChange={this.handleCredentialUpdate} required/>
              </div>
              <ErrorLabel className={this.state.passwordMatch ? 'hidden' : null}>Passwords Don't Match</ErrorLabel>
              <ButtonContainer>
                  <CancelButton onClick={this.clearForm}>Cancel</CancelButton>
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
