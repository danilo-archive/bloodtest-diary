import React, { Component } from 'react';
import styled from "styled-components";

import Select from 'react-select';

const Container = styled.div`
  height: auto;
  width: 100%;
  padding-bottom: 10px;
  background: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  font-family: "Rajdhani", sans-serif;
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
    transition: all 0.14s linear;
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
    transition: all 0.14s linear;
    color: #646464;
    font-size: 120%;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;

    margin-right: 10px;

    height: 34px;
    min-width: 70px;
    width: 70px;
    max-width: 70px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    outline: none;
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

const ErrorLabel = styled.p`
  color: red;
  margin: 0 auto;
  white-space: nowrap;
  cursor: default;
  text-align: center;

  font-family: "Rajdhani", sans-serif;
  animation: opac 1s linear 1;
`;

const MessageLabel = styled.p`
  margin: 0 auto;
  white-space: nowrap;
  cursor: default;
  text-align: center;
  font-size: 105%;

  font-family: "Rajdhani", sans-serif;
  animation: opac 1s linear 1;
`;

const colourStyles = {
  control: (styles, { data, isDisabled, isFocused, isSelected }) => ({ ...styles, backgroundColor: isDisabled ? '#ddd' : 'white'}),
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



const users = [
  { label: "Jonny Boy", value: 1 },
  { label: "John Snow", value: 2 },
  { label: "Sansa Stark", value: 3 },
  { label: "Little Finger", value: 4 },
  { label: "The Mountain", value: 5 },
  { label: "Sam", value: 6 },
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
         passwordMatch: true,
         mainState: false,
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
    if (this.state.disabled) {
      return
    } else {
      this.state.email = ""; //TODO GET CURRENT EMAIL OF USER
      this.setState({selectedOption , disabled: true});
   }
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
     this.showInfoMessage()
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
     this.showInfoMessage()
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

 showInfoMessage = () => {
     this.setState({mainState: true})
     setTimeout( () => {
         this.setState({mainState: false})
     }, 5000);
 }


  render(){
    return (
      <Container>

        <p className="userTitle">Users</p>

        <MenuContainer>
          <div className={this.state.disabled ? 'disabled' : 'addUser'} onClick={this.onAddUser}>Add User</div>

          <Select
            className="userSelect"
            styles={colourStyles}
            placeholder="Edit User..."
            value={this.state.selectedOption}
            options={users}
            onChange={this.handleChange}
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

        <MessageLabel className={this.state.mainState ? null : 'hidden'}>Database Updated</MessageLabel>
      </Container>
    )
  }
}
