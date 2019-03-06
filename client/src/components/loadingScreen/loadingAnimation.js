import React, { Component } from 'react';
import styled from "styled-components";

const Animation = styled.div`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 5px;
  font-family: "Rajdhani", sans-serif;
  font-size: 150%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default class extends Component{
    render(){
        return(
          <Animation>
            <div id='l1' class='line'></div>
            <div id='l2' class='line'></div>
            <div id='l3' class='line'></div>
            <div id='l4' class='line'></div>
            <div id='l5' class='line'></div>
            <div id='l6' class='line'></div>
            <div id='l7' class='line'></div>
            <div id='l8' class='line'></div>
            <div id='l9' class='line'></div>
            <div id='l10' class='line'></div>
          </Animation>
        )
    }
}
