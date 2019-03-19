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
    color: #0b999d;
  }


    .inputSection {

      width: 75%;

      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      border: solid 1px #b3b3b3;
      border-radius: 5px;
      margin: 10px;
      padding: 5px;
      padding-left: 8px;

      font-size: 120%;

    }

    .usersLabel {
      width: auto;
      margin-right: 8px;
      color: #646464;
      white-space: nowrap;
    }

    .usersInput {
      width: 100%;
      color: #0b999d;
    }

    .inputSection:focus-within {
      box-shadow: 0 0 2px #0b999d;
    }

`;

const ButtonContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const CancelButton = styled.button`
  border: none;
  background-color: #e7e7e7;
  color: black;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;
  margin: 4%;

  :hover {
    background: #c8c8c8;
    color: black;
    border-radius: 10px;
  }
  outline: none;
`;

const SaveButton = styled.button`
  border: none;
  background-color: #0b999d;
  color: white;
  text-align: center;
  text-decoration: none;
  margin: 4%;
  border-radius: 10px;

  height: 44px;
  min-width: 100px;

  :hover {
    background-color: #018589;
    color: white;
  }
  outline: none;
`;

const scaryAnimals = [
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
         email: "",
         password: "",
         confirmPassword: "",
      };

      this.handleCredentialUpdate = this.handleCredentialUpdate.bind(this);
  }

  handleCredentialUpdate(event) {
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

   console.log(`Option selected:`, selectedOption);
 }

 onCancelClick = () => {
   this.setState({
     selectedOption: null,
     disabled: false,
     email: "",
     password: "",
     confirmPassword: "",
  })
 }

 onSaveClick = () => {
   //Update Database with new email and password
   this.setState({
     selectedOption: null,
     disabled: false,
     email: "",
     password: "",
     confirmPassword: "",
  })
 }


  render(){
    return (
      <Container>
        <p className="userTitle">Users</p>
        <Select
          className="userSelect"
          placeholder="Edit User..."
          value={this.state.selectedOption}
          options={scaryAnimals}
          onChange={this.handleChange}
          isDisabled={this.state.disabled}
        />

        {this.state.selectedOption ?
          <>
            <div className="inputSection">
              <div className="usersLabel">Email:</div>
              <input id="emailInput" type="text" name="email" className="usersInput" value={this.state.email} onChange={this.handleCredentialUpdate}/>
            </div>
            <div className="inputSection">
              <div className="usersLabel">New Password:</div>
              <input id="passwordInput" type="password" name="password" className="usersInput" value={this.state.password} onChange={this.handleCredentialUpdate}/>
            </div>
            <div className="inputSection">
              <div className="usersLabel">Confirm Password:</div>
              <input id="confrimPasswordInput" type="password" name="confirmPassword" className="usersInput" value={this.state.confirmPassword} onChange={this.handleCredentialUpdate}/>
            </div>
            <ButtonContainer>
                <CancelButton onClick={this.onCancelClick}>Cancel</CancelButton>
                <SaveButton onClick={this.onSaveClick}>Save</SaveButton>
            </ButtonContainer>
          </>
        :
          <>
          </>
        }


      </Container>
    )
  }
}
