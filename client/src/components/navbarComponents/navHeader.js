import React, { Component } from 'react';
import styled from "styled-components";

import Label from "./../Label";

const Container = styled.div`
  width: auto;
  min-height: 50px;
  max-height: 50px;

  padding-left: 10px;
  background-color: #0d4e56;


  align-self: stretch;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  font-family: "Rajdhani", sans-serif;
  color: #e2e2d9;
  font-size: 150%;


`;

const ButtonContainer = styled.div`
  width: 167px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .homeButton {
    background-color: #0d4e56;
    width: 100px;
    height: 100%;
    text-align: center;
    border-radius:  0;
    cursor: pointer;
    border: none;
    outline: none;
  }

  .homeButton:focus,
  .homeButton:hover {
    color: #e2e2d9;
  }
`;


export default class NavHeader extends Component {
    constructor(props){
        super(props);
        this.onHomeClick = props.onHomeClick;
    }

    render(){
      return (
      <Container>
          <div>Dashboard</div>
          <ButtonContainer>
            <div className={"homeButton"} onClick={this.onHomeClick}>Home</div>
          </ButtonContainer>
      </Container>
      )
    }
}
