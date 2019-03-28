/**
 * This class renders one section of add/edit patient modal.
 * It requires title as text and actual html code that it will place into ContentContainer.
 *
 * @author Jakub Cerven
 */

import React from "react";
import styled from 'styled-components'

const Container = styled.div`
  margin: 0.5% 0;
  padding: 0.5%;
  width: 80%;
  
  background: white;
  max-height: 300px;
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

const TitleContainer = styled.div`
  width: 100%;
  height: auto;
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
                    <TitleContainer>
                        <SectionTitle>{this.props.title}</SectionTitle>
                    </TitleContainer>
                    {this.props.content}
                </ContentContainer>
            </Container>

        );
    }
};
