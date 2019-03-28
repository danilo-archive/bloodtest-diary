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

const ControlButton = styled.div`
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


export default class ControlButtons extends Component {

    constructor(props){
        super(props);
    }

    getButtons() {
        switch(this.props.page) {
          case 'Dashboard':
            return (
              <>
                <ControlButton marginTop={"10px"} onClick={this.props.onPatientsClick}>Patients</ControlButton>
                <ControlButton marginTop={"10px"} onClick={this.props.onSignoutClick}>Sign out</ControlButton>
              </>
            );
          case 'Patients':
            return (
              <>
                <ControlButton disabled marginTop={"10px"} onClick={this.props.onPatientsClick}>Patients</ControlButton>
                <ControlButton marginTop={"10px"} onClick={this.props.onSignoutClick}>Sign out</ControlButton>
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
