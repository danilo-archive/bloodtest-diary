import React, { Component } from 'react';
import styled from "styled-components";

const Alert = styled.div`

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  
  color: #646464;
  font-size: 130%;

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
    margin: 5px 20px 0px;
    text-align: center;

    overflow: scroll;
  }

  .alertButtonContainer {
    border: solid 0 red;
    border-top: solid 1px rgb(131,149,149, 0.8);

    min-height: 60px;
    max-height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .confirmationButton {

    

    border: solid 1px #0b999d;
    border-radius: 4px;

    color: #646464;

    width: auto;
    min-width: 20%;
    height: auto;
    padding: 2px 5px;
    margin: 3% 5% 3% 3%;
    cursor: pointer;
    outline:none;

    text-align: center;
  }

  .confirmationButton:focus,
  .confirmationButton:hover {
    background-color:  rgb(244,249,253);
  }
`;

export default class ConfirmationAlert extends Component {

    onOption1Click = event => {
        this.props.closeAlert();
        if(this.props.option1Callback){this.props.option1Callback()}
    };

    render(){
      return (
          <>
            <Alert>
              <div className="alertMessageContainer">
                <p className="alertMessage">{this.props.message}</p>
              </div>
              <div className="alertButtonContainer">
                <div className={"confirmationButton"} onClick={this.onOption1Click}>{this.props.option1Text}</div>
              </div>
            </Alert>
          </>
      )
    }
}
