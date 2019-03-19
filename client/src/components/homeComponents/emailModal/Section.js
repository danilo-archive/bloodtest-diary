import React from "react";
import styled from "styled-components";
import TestBox from "./TestBox";
import HorizontalLine from "../calendarComponents/HorizontalLine";
import ScrollBox from "../calendarComponents/ScrollBox";

const Container = styled.div``;

export default props => {
  return (
    <>
      <Container>
        <div>
          <HorizontalLine style={{ opacity: "0.4" }} />
          {props.tests.map(test => {
            return (
              <div key={test.testId}>
                <TestBox
                  onCheck={(checked, user) => {
                    props.select(checked, user);
                  }}
                  selected={props.selected.find(
                    exam => test.testId === exam.testId
                  )}
                  text={test.patientName}
                  dueDate={test.dueDate}
                  testId={test.testId}
                />
              </div>
            );
          })}
          <HorizontalLine style={{ opacity: "0.4" }} />
        </div>
      </Container>
    </>
  );
};
