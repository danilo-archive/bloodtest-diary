import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`
  height: 200px;
  width: 100%;
  background: white;
`;

export default class ConnectionPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
        ip: "",
        port: ""
      };
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
        <input id="ipInput" type="text" name="ip" className="" value={this.state.ip} onChange={this.handleChange} placeholder="192.178.1.1"/>
        <input id="portInput" type="text" name="port" className="" value={this.state.port} onChange={this.handleChange} placeholder="5000"/>

      </Container>
    )
  }
}
