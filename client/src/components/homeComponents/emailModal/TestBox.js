import styled from "styled-components";
import React from "react";
import DateBullet from "./DateBullet";
import TextRadioButton from "../editTest/TextRadioButton";
import RadioButton from "../editTest/RadioButton";
import TextLabel from "../editTest/Label";
import TimePill from "../calendarComponents/TimePill";
const Container = styled.div`
  height: 40px;
  width:  ${props => (props.title ? `90%` : `80%`)}
  margin:auto;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  ${props => (props.title ? `justify-content:center;` : ``)}

  background: white;
  border: 1px #e8e8e8 solid;
  white-space: nowrap;
  ${props =>
    props.title
      ? `box-shadow: 0px 0px 5px 2px rgba(176,176,176,1); z-index:1;`
      : `z-index:-1;`}
    
  text-align: center;
`;
const Label = styled(TextLabel)`
  font-size: ${props => (props.title ? `30px` : `25px`)};
  color: #0d4e56;
`;
export default props => {
  return (
    <Container title={props.title}>
      {!props.title ? <DateBullet dueDate={props.dueDate} /> : ``}
      {!props.title ? (
        <div
          style={{
            padding: "2% 0 0 0",
            flex: "1",
            margin: "0 0.7rem",
            overflow: "scroll",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "nowrap"
          }}
        >
          <Label title={props.title}>{props.text}</Label>
        </div>
      ) : (
        <Label style={{ margin: "0 20%" }} title={props.title}>
          {props.text}
        </Label>
      )}

      {props.title ? (
        <TextRadioButton
          checked={props.selected}
          onCheck={checked => props.onAllCheck(checked)}
          text="Select All"
        />
      ) : (
        <RadioButton
          checked={props.selected}
          onCheck={checked =>
            props.onCheck(checked, {
              patientName: props.text,
              dueDate: props.dueDate,
              testId: props.testId
            })
          }
        />
      )}
    </Container>
  );
};
