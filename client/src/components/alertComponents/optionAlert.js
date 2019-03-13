import React, { Component } from 'react';
import styled from "styled-components";

const Alert = styled.div`

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  font-family: "Rajdhani", sans-serif;
  color: #646464;
  font-size: 150%;

  .alertMessageContainer {
    border: solid 0px blue;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    overflow: hidden;

  }

  .alertMessage {
    margin-right: 20px;
    margin-left: 20px;

    margin-top: 5px;
    margin-bottom: 0px;
    text-align: center;

    overflow: scroll;
  }

  .alertButtonContainer {
    border: solid 0px red;
    border-top: solid 1px rgb(131,149,149, 0.8);

    min-height: 60px;
    max-height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  .optionButton {

    font-family: "Rajdhani", sans-serif;

    border: solid 1.5px #0b999d;
    border-radius: 4px;

    color: #646464;

    width: auto;
    min-width: 20%;
    height: auto;
    padding: 2px;
    padding-left: 5px;
    padding-right: 5px;
    margin: 3%;
    cursor: pointer;
    outline:none;

    text-align: center;
  }

  .optionButton:focus,
  .optionButton:hover {
    background-color:  rgb(244,249,253);
  }
`;

export default class OptionAlert extends Component {

    render(){
      return (
          <>
            <Alert>
              <div className="alertMessageContainer">
                <p className="alertMessage">{this.props.message}</p>
              </div>
              <div className="alertButtonContainer">
                <div className={"optionButton"} onClick={()=>{ this.props.closeAlert(); this.props.option2Callback() }}>{this.props.option2Text}</div>
                <div className={"optionButton"} onClick={()=>{ this.props.closeAlert(); this.props.option1Callback() }}>{this.props.option1Text}</div>
              </div>
            </Alert>
          </>
      )
    }
}
