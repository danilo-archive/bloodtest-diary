import React from "react";
import styled from 'styled-components'

const Container = styled.div`
  margin: 1% 0;
  padding: 1%;
  border: #839595 3px solid;
  border-radius: 10px;
  width: 80%;
  
  background: white;
  max-height: 225px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
`;

const SectionTitle = styled.p`
  text-align: center;
  font-size: 150%;
  margin: 0;
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
