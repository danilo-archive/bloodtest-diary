import React, { Component } from 'react';
import styled from "styled-components";

import Label from "./../Label";
import refresh from "../../images/refresh.png"

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
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
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

const RefreshButton = styled.div`
  max-height: 21px;
  max-width: 21px;
  padding: 7px;
  margin-right: 10px;
  border-radius: 20%;
  cursor: pointer;
  z-index: 50;

  &:hover {
    transform: scale(1.1,1.1)
  }

  .refreshIcon {
  width:100%;
  height:100%;
  }

`;


export default class NavHeader extends Component {
    constructor(props){
        super(props);
        this.onHomeClick = props.onHomeClick;
        this.onRefreshClick = props.onRefreshClick;
    }

    render(){
      return (
      <Container>
          <div>Dashboard</div>
          <ButtonContainer>
            <div className={"homeButton"} onClick={this.onHomeClick}>Home</div>
          </ButtonContainer>
          <RefreshButton onClick={this.onRefreshClick}>
             <img className={"refreshIcon"} src={refresh} alt={"Refresh Button"}/>
          </RefreshButton>
      </Container>
      )
    }
}
