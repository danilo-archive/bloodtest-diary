import React from "react";
import styled from 'styled-components'

const Container = styled.div`
  margin: 1% 10%;
  padding: 1%;
  border: #839595 3px solid;
  border-radius: 10px;
  width: 80%;
  font-family: "Rajdhani", sans-serif;
  background: white;
`;

const ContentContainer = styled.div`
  padding-left: 6%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
`;

const SectionTitle = styled.p`
  float: left;
  position: absolute;
  font-size: 150%;
  margin-left: 2%;
  //TODO : change this depending on container size
  @media only screen and (max-width: 600px) {
    visibility: hidden;
  }
`;

export default class SectionContainer extends React.Component {
    render() {
        return (
            <Container>
                <SectionTitle>{this.props.title}</SectionTitle>
                <ContentContainer>
                    {this.props.content}
                </ContentContainer>
            </Container>

        );
    }
};
