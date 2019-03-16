import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import TestCell from "./profileCells/TestCell";
import Label from "./profileCells/Label";
import SectionContainer from "./SectionContainer"

const Container = styled.div`
  margin: 3%;
  padding: 1%;
  width: 100%;
  overflow: scroll;
 `;

const Line = styled.hr`
  border: 0;
  border-bottom: solid 1px rgb(100, 100, 100, 0.5);
`;

const EmptyContainer = styled.div`
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
  font-family: "Rajdhani", sans-serif;
  font-size: 125%;
  overflow: scroll;
  display: flex;
  align-items: center;;
`;

const Horizontal = styled.div`
    display: flex;
    width: 90%;
`;

const CellContainer = styled.div`
  display: block;
  overflow: scroll;
  width: 90%;
  max-height: 160px;
`;




export default class PatientSection extends React.Component {


    render() {
        const content = (
          <>
                  <Horizontal>
                      <Field>Due</Field>
                      <Field>Notes</Field>
                  </Horizontal>
                  <CellContainer>
                      {this.props.tests.map(test => (
                          <TestCell
                              key={test.test_id}
                              testId={test.test_id}
                              due = {test.due_date.substring(0, 10)}
                              notes={test.notes}
                              deleteTest={this.props.deleteTest}
                          />
                      ))}
                  </CellContainer>
          </>
        );
        const emptyTest = (
            <>
                <EmptyContainer>Patient has no tests scheduled</EmptyContainer>
            </>
        );
        if (this.props.tests.length > 0) {
            return (
                <>
                    <SectionContainer
                        title={"Test info"}
                        content={content}
                    />
                </>
            );
        } else {
            return (
                <>
                    <SectionContainer
                        title={"Test info"}
                        content={emptyTest}
                    />
                </>
            );
        }
    }
}
