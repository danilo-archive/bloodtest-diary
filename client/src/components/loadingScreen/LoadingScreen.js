import React, { Component } from 'react';
import styled from "styled-components";
import LoadingAnimation from "./loadingAnimation";
import "./loadingScreen.css";

const Title = styled.p`
  
  font-size: 130%;
  font-weight: 600;
  margin: 0;
`;

const Message = styled.p`
  
  font-size: 110%;
  margin: 0;
`;


export default class extends Component{
    render(){
        return(
              <div className={"alertWindow"}>
                <LoadingAnimation/>
                <div className={"dialog"}>
                  <Title>Waiting for a server response...</Title>
                  <Message>(If the problem persists, please, contact your IT department.)</Message>
                </div>
              </div>
        )
    }
}
