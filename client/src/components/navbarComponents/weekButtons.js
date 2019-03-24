import React, { Component } from 'react';
import styled from "styled-components";

import arrow from "../../resources/images/arrow.png";

const Container = styled.div`
  border: green 0 solid;
  width: 113px;
  height: 50px;

  display: flex;
  flex-direction: row;
  align-items: center;

`;

const PreviousArrow = styled.img`
    width: 50%;
    cursor: pointer;
    transition: width 0.3s;
    opacity: 0.75;
    :hover {
      opacity: 1;
    }
`;

const NextArrow = styled.img`
    width: 50%;
    cursor: pointer;
    transform: rotate(180deg);
    transition: 0.3s;
    opacity: 0.75;
    :hover {
      opacity: 1;
    }
`;


export default class WeekButtons extends Component {

    constructor(props){
        super(props);
    }

    render(){
      return (
        <Container>
          <PreviousArrow src={arrow} onClick={this.props.onPrev} alt={"Previous Date"}/>
          <NextArrow src={arrow} onClick={this.props.onNext} alt={"Next Date"}/>
        </Container>
      )
    }
}
