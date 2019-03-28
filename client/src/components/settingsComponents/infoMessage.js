import React from "react";
import styled from "styled-components";

const Container = styled.p`
    margin: 0 auto;
    white-space: nowrap;
    cursor: default;
    text-align: center;
    font-size: 105%;

    position: relative;
    animation: opac 1s linear 1;

    height: 10px;
    margin-bottom: 10px;
    .error {
      color: red;
    }
  }
`;

export default class InfoMessage extends React.Component {
  render() {
    if (this.props.show) {
      return (
        <>
          <Container>
            <div className={this.props.type}>{this.props.message}</div>
          </Container>
        </>
      );
    }else {
      return (
        <>
        <Container/>
        </>
      );
    }
  }
}
