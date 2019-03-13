import React, { Component } from 'react';
import styled from "styled-components";

const Alert = styled.div`

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: stretch;

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

    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;

    overflow: scroll;
  }
`;

export default class DialogAlert extends Component {

    render(){
      return (
          <>
            <Alert>
              <div className="alertMessageContainer">
                <p className="alertMessage">{this.props.message}</p>
              </div>
            </Alert>
          </>
      )
    }
}
