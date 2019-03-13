import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`

  min-width: 15rem;
  width: 18vw;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 98px;
  border: solid 0px #97a9a9;
  text-align: center;
  font-family: "Rajdhani", sans-serif;
  color: #646464;
  font-size: 150%;

  align-self: stretch;


  .patientsButton {
    border: solid 0px #97a9a9;
    background-color: ;
    width: 100px;
    height: 31px;
    margin-right: 45px;
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
    margin-right:45px;
    cursor: pointer;
    outline:none;
    align-self: flex-end;
  }


  .signOutButton:focus,
  .signOutButton:hover {
    color: #e2e2d9;
  }
  .patientsButton:focus,
  .patientsButton:hover {
    color: #e2e2d9;
  }
`;


export default class ControlButtons extends Component {

    constructor(props){
        super(props);
        this.onPatientsClick = props.onPatientsClick;
        this.onSignoutClick = props.onSignoutClick;
    }

    render(){
      return (
        <Container>
          <div className={"patientsButton"} onClick={this.onPatientsClick}>Patients</div>
          <div className={"signOutButton"} onClick={this.onSignoutClick}>Sign Out</div>
        </Container>
      )
    }
}
