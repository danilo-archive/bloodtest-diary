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
`;

const SignoutButton = styled.div`
  position: relative;
  margin-top: ${props => props.marginTop ? props.marginTop : "0"}
  border: solid 0px #97a9a9;
  background-color: ;
  width: 100px;
  height: 31px;
  margin-right:44px;
  cursor: pointer;
  outline:none;
  align-self: flex-end;
  :hover{
    color: black;
  }
`;


const PatientsButton = styled.div`
  position: relative;
  margin-top: ${props => props.marginTop ? props.marginTop : "0"}
  border: solid 0px #97a9a9;
  background-color: ;
  width: 100px;
  height: 31px;
  margin-right: 44px;
  border-radius:  0;
  cursor: pointer;
  outline:none;
  align-self: flex-end;
  :hover{
    color: black;
  }
`;


export default class ControlButtons extends Component {

    getButtons() {
        switch(this.props.page) {
          case 'Dashboard':
            return (
              <>
                <PatientsButton marginTop={"10px"} onClick={this.props.onPatientsClick}>Patients</PatientsButton>
                <SignoutButton marginTop={"10px"} onClick={this.props.onSignoutClick}>Sign out</SignoutButton>
              </>
            );
          case 'Patients':
            return (
                <SignoutButton marginTop={"48px"} onClick={this.props.onSignoutClick}>Sign out</SignoutButton>
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
