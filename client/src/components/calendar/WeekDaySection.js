import React from "react";
import styled from "styled-components";

import NotificationIcon from "./NotificationIcon";
import Label from "../Label";

const WeekDayDiv = styled.div`
  width: 100%;
  height: 11%;
  background-color: #0d4e56;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;
const WeekDaySection = props => {
  return (
    <>
      <WeekDayDiv>
        <NotificationIcon
          text={props.notificationNumber}
          top="-10%"
          left="50%"
        />
        <Label style={{ left: "50%", top: "50%" }} fontSize={"30px"}>
          {props.dayName}
        </Label>
      </WeekDayDiv>
    </>
  );
};

export default WeekDaySection;
