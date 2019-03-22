import React, { Component } from 'react';
import styled from "styled-components";

import arrow from "./../../images/arrow.png";

const Container = styled.div`
  border: green 0px solid;
  width: 113px;
  height: 42px;

  display: flex;
  flex-direction: row;
  align-items: center;

  .prevButton {
    width: 50%;
    cursor: pointer;
  }
  .nextButton {
    width: 50%;
    cursor: pointer;
    transform: rotate(180deg);
  }
`;


export default class WeekButtons extends Component {

    constructor(props){
        super(props);
        this.onPrev = props.onPrev;
        this.onNext = props.onNext;
    }

    render(){
      return (
        <Container>
          <img src={arrow} className={"prevButton"} onClick={this.onPrev} alt={"Previous Date"}/>
          <img src={arrow} className={"nextButton"} onClick={this.onNext} alt={"Next Date"}/>
        </Container>
      )
    }
}
