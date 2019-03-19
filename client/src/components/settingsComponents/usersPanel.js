import React, { Component } from 'react';
import styled from "styled-components";

import Select from 'react-select';

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


  .userTitle {
    margin: 15px;
    margin-bottom: 5px;
  }

  .userSelect {

    width: 75%;
  }
`;

const scaryAnimals = [
  { label: "Alligators", value: 1 },
  { label: "Crocodiles", value: 2 },
  { label: "Sharks", value: 3 },
  { label: "Small crocodiles", value: 4 },
  { label: "Smallest crocodiles", value: 5 },
  { label: "Snakes", value: 6 },
];

//someArrayOfStrings.map(opt => ({ label: opt, value: opt }));

export default class UsersPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
      };
  }

  render(){
    return (
      <Container>
        <p className="userTitle">Users</p>
        <Select
          className="userSelect"
          options={scaryAnimals}
          onChange={opt => console.log(opt.label, opt.value)}
        />

      </Container>
    )
  }
}
