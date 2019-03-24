import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`

  min-width: 15rem;
  width: 18vw;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  height: 98px;
  border: solid 0px #97a9a9;
  text-align: center;
  
  color: #646464;
  font-size: 150%;

  align-self: stretch;


  .patientsButton {
    border: solid 0px #97a9a9;
    background-color: ;
    width: 100px;
    height: 31px;
    margin-right: 44px;
    border-radius:  0;
    cursor: pointer;
    outline:none;
    align-self: flex-end;
  }

  .signOutButton {
    border: solid 0px #97a9a9;
    background-color: ;
    width: 100px;
    height: 31px;
    margin-right:44px;
    cursor: pointer;
    outline:none;
    align-self: flex-end;

  }


  .signOutButton:focus,
  .signOutButton:hover {
    color: black;
  }
  .patientsButton:focus,
  .patientsButton:hover {
    color: black;
  }
`;


export default class ControlButtons extends Component {

    constructor(props){
        super(props);
        this.onPatientsClick = props.onPatientsClick;
        this.onSignoutClick = props.onSignoutClick;
    }

    getButtons() {
        switch(this.props.page) {
          case 'Dashboard':
            return (
              <>
                <div className={"patientsButton"} onClick={this.onPatientsClick}>Patients</div>
                <div className={"signOutButton"} onClick={this.onSignoutClick}>Sign out</div>
              </>
            );
          case 'Patients':
            return (
              <>
                <div className={"signOutButton"} onClick={this.onSignoutClick}>Sign out</div>
              </>
            );
          default:
            return null;
        }
    }

    render(){
      const content = this.getButtons();
      return (
        <Container>
          {content}
        </Container>
      )
    }
}
