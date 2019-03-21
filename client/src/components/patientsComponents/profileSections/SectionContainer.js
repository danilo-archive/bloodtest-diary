import React from "react";
import styled from 'styled-components'

const Container = styled.div`
  margin: 0.5% 0;
  padding: 0.5%;
  border: #839595 3px solid;
  border-radius: 10px;
  width: 80%;
  font-family: "Rajdhani", sans-serif;
  background: white;
  max-height: 225px;
  display: flex;
  height: 10%;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
`;

const SectionTitle = styled.p`
  text-align: center;
  font-size: 150%;
  margin: 0;
  width: 100%;
`;

export default class SectionContainer extends React.Component {
    render() {
        return (
            <Container>

                <ContentContainer>
                    <SectionTitle>{this.props.title}</SectionTitle>
                    {this.props.content}
                </ContentContainer>
            </Container>

        );
    }
};
