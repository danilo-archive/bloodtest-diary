import React, { Component } from 'react';
import styled from "styled-components";
import LoadingScreen from "./loadingScreen/LoadingScreen.js";

const Screen = styled.div`
  position:absolute;
  top: 28px;
  overflow:hidden;
  height: 100vh;
  width: 100vw;
  background-color: ${props => (props.disabled ? `rgb(0, 0, 0, 0.5)` : ` rgb(0, 0, 0, 0.0)`)};
  z-index: ${props => (props.disabled ? `100` : `0`)};
`;

export default class OfflineScreen extends Component {

    render(){
        if (this.props.disabled){
            return (
                <>
                <LoadingScreen />
                <Screen disabled = {true}/>
                </>
            )
        } else {
            return "";
        }
    }
}
