import React, { Component } from 'react';
import styled from "styled-components";
import LoadingAnimation from "./loadingAnimation";
import "./loadingScreen.css";

const Title = styled.p`
  font-family: "Rajdhani", sans-serif;
  font-size: 130%;
  font-weight: 600;
  margin: 0;
`;

const Message = styled.p`
  font-family: "Rajdhani", sans-serif;
  font-size: 110%;
  margin: 0;
`;


export default class extends Component{
    render(){
        return(
              <div className={"alertWindow"}>
                <LoadingAnimation/>
                <div className={"dialog"}>
                  <Title>Connection to server lost...</Title>
                  <Message>If the problem persists contact your IT department.</Message>
                </div>
              </div>
        )
    }
}
