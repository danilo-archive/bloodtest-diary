import React, { Component } from 'react';
import styled from "styled-components";
import LoadingScreen from "./loadingScreen/LoadingScreen.js";

const Screen = styled.div`
  position:absolute;
  overflow:hidden;
  height: 100vh;
  width: 100vw;
  background-color: rgb(0, 0, 0, 0.7);
  z-index: 100;
`;

export default class OfflineScreen extends Component {

    render(){
        if (this.props.disabled){
            return (
                <>
                  <LoadingScreen />
                  <Screen/>
                </>
            )
        } else {
            return "";
        }
    }
}
