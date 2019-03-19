import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`
  height: auto;
  width: 100%;
  padding-bottom: 20px;
  background: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  font-family: "Rajdhani", sans-serif;
  color: #646464;
  font-size: 150%;


  .inputSection {

    width: 75%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    border: solid 1px #646464;
    border-radius: 5px;
    margin: 10px;
    padding: 5px;
    padding-left: 8px;

  }

  .connectionTitle {
    margin: 15px;
    margin-bottom: 5px;
  }

  .connectionLabel {
    width: auto;
    margin-right: 8px;
    font-size: 90%;
    color: #646464;
  }

  .connectionInput {
    width: 100%;
    color: #0b999d;
  }

  .inputSection:focus-within {
    box-shadow: 0 0 2px #0b999d;
  }
`;

export default class ConnectionPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
        //TODO: Get ip and port from serverConnect
        ip: "192.168.1.1",
        port: "5000"
      };

      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render(){
    return (
      <Container>
        <p className="connectionTitle" >Connection</p>

        <div className="inputSection">
          <div className="connectionLabel">IP:</div>
          <input id="ipInput" type="text" name="ip" className="connectionInput" value={this.state.ip} onChange={this.handleChange}/>
        </div>
        <div className="inputSection">
          <div className="connectionLabel">Port:</div>
          <input id="portInput" type="text" name="port" className="connectionInput" value={this.state.port} onChange={this.handleChange}/>
        </div>
      </Container>
    )
  }
}
