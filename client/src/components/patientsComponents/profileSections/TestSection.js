import React from "react";
import styled from "styled-components";
import TestCell from "./profileCells/TestCell";
import SectionContainer from "./SectionContainer"

const Container = styled.div`
  width: 95%;
`;

const EmptyContainer = styled.div`
  margin-top: 1%;
  width: 100%;
  text-align: center;
  font-size: 115%;
`;

const Field = styled.div`
  position: relative;
  padding-left: 1%;
  width: 30%;
  min-width: 10%;
  margin: 0 2.5%;
  height: 100%;
  color: inherit;
  
  font-size: 125%;
  overflow: scroll;
  display: flex;
  align-items: center;;
`;

const Horizontal = styled.div`
  margin-top: 1%;
  display: flex;
`;

const CellContainer = styled.div`
  display: block;
  overflow: scroll;
  max-height: 160px;
`;




export default class PatientSection extends React.Component {


    render() {
        const content = (
            <Container>
                <Horizontal>
                    <Field>Due date:</Field>
                    <Field>Notes:</Field>
                </Horizontal>
                <CellContainer>
                    {this.props.tests.map(test => (
                        <TestCell
                            key={test.test_id}
                            testId={test.test_id}
                            due = {test.due_date}
                            notes={test.notes}
                            deleteTest={this.props.deleteTest}
                        />
                    ))}
                </CellContainer>
            </Container>
        );
        const emptyTest = (
            <>
                <EmptyContainer>(Patient has no tests scheduled.)</EmptyContainer>
            </>
        );
        if (this.props.tests.length > 0) {
            return (
                <>
                    <SectionContainer
                        title={"Patient's outstanding tests"}
                        content={content}
                    />
                </>
            );
        } else {
            return (
                <>
                    <SectionContainer
                        title={"Patient's outstanding tests"}
                        content={emptyTest}
                    />
                </>
            );
        }
    }
}
