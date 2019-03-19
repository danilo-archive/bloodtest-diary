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


  .connectionTitle {
    font-size: 140%;
    margin: 15px;
    margin-bottom: 5px;
  }

`;


const InputSection = styled.div`
  width: 75%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border: solid 1px #b3b3b3;
  border-radius: 5px;
  margin: 10px;
  padding: 5px;
  padding-left: 8px;

  font-size: 120%;

  .connectionInput {
    width: 100%;
    color: #0b999d;
  }

  &:focus-within {
    border: solid 1px #0b999d;
  }

`;

const ConnectionLabel = styled.div`
  width: auto;
  margin-right: 8px;
  color: #646464;
  white-space: nowrap;
`;



export default class ConnectionPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
        //TODO: Get current ip and port from client
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

  updateIP() {
    //Update client Ip wiith state.ip
  }

  updatePort() {
    //Update client port wiith state.port
  }

  render(){
    return (
      <Container>
        <p className="connectionTitle" >Connection</p>
        <InputSection>
          <ConnectionLabel>IP:</ConnectionLabel>
          <input id="ipInput" type="text" name="ip" className="connectionInput" value={this.state.ip} onChange={this.handleChange} onBlur={this.updateIP}/>
        </InputSection>
        <InputSection>
          <ConnectionLabel>Port:</ConnectionLabel>
          <input id="portInput" type="text" name="port" className="connectionInput" value={this.state.port} onChange={this.handleChange} onBlur={this.updatePort}/>
        </InputSection>
      </Container>
    )
  }
}
