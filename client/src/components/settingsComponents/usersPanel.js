import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`
  height: 200px;
  width: 100%;
  background: white;
`;

export default class UsersPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
      };
  }

  render(){
    return (
      <Container>

      </Container>
    )
  }
}
