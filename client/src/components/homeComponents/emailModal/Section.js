import React from "react";
import styled from "styled-components";
import TestBox from "./TestBox";
import HorizontalLine from "../calendarComponents/HorizontalLine";
import ScrollBox from "../calendarComponents/ScrollBox";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { relative } from "path";
import TimePill from "../calendarComponents/TimePill";
import formatDate from "dateformat";

const Container = styled.div``;
const TestContainer = styled.div`
  & .pill {
    opacity: 0;
    transition: 250ms;
  }

  &:hover .pill {
    opacity: 1;
  }
`;
const PillDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: auto;
  background-color: #0b999d;
  color: white;
  
  transform: translate(-50%, -50%);
  padding: 0% 5% 0% 5%;
  top: -20%;
  left: 50%;
`;
export default props => {
  const TESTJSX = test => (
    <TestContainer
      key={test.testId}
      style={{
        position: "relative",

        overflow: "show",
        margin: "15px 0"
      }}
    >
      {test.lastReminder ? (
        <PillDiv className="pill">
          Last reminder:{" "}
          {formatDate(new Date(test.lastReminder), "dS mmm yyyy")}
        </PillDiv>
      ) : (
        ``
      )}
      <TestBox
        noCheck={props.awaitResponse}
        fail={
          props.response &&
          failedTests.find(failedId => test.testId === failedId)
        }
        onCheck={(checked, user) => {
          props.select(checked, user);
        }}
        selected={props.selected.find(exam => test.testId === exam.testId)}
        text={test.patientName}
        dueDate={test.dueDate}
        testId={test.testId}
      />
    </TestContainer>
  );

  const failedTests = props.response
    ? [
        ...props.response.failedBoth,
        ...props.response.failedPatient,
        ...props.response.failedHospital
      ]
    : [];

  return (
    <>
      <Container>
        <div>
          <HorizontalLine style={{ opacity: "0.4" }} />
          {props.tests.map(test => {
            return props.response &&
              !failedTests.find(failedId => test.testId === failedId) ? (
              ``
            ) : props.awaitResponse ? (
              <Tooltip
                title={
                  props.response.failedBoth.find(id => test.testId === id)
                    ? "Failed to send to both patient and hospital."
                    : props.response.failedPatient.find(
                        id => test.testId === id
                      )
                    ? "Failed to send to patient, successfully sent to hospital."
                    : "Failed to send to hospital, successfully sent to patient."
                }
                position="right-end"
                trigger="mouseenter"
              >
                {TESTJSX(test)}
              </Tooltip>
            ) : (
              TESTJSX(test)
            );
          })}
          <HorizontalLine style={{ opacity: "0.4" }} />
        </div>
      </Container>
    </>
  );
};
