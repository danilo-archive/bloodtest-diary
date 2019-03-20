import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%,-50%)"
`;
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
            <div id='l1' className={'line'}></div>
            <div id='l2' className={'line'}></div>
            <div id='l3' className={'line'}></div>
            <div id='l4' className={'line'}></div>
            <div id='l5' className={'line'}></div>
            <div id='l6' className={'line'}></div>
            <div id='l7' className={'line'}></div>
            <div id='l8' className={'line'}></div>
            <div id='l9' className={'line'}></div>
            <div id='l10' className={'line'}></div>
          </Animation>
        )
    }
}
