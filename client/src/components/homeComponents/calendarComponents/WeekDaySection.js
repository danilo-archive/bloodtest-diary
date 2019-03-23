import React from "react";
import styled from "styled-components";

import NotificationIcon from "./NotificationIcon";
import Label from "../../Label";

const WeekDayDiv = styled.div`
  width: auto;
  height: 50px;
  background-color: #0d4e56;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const WeekDaySection = props => {
  return (
    <>
      <WeekDayDiv>
        <NotificationIcon
          text={props.notificationNumber}
          top="50%"
          left="12%"
        />
        <Label style={{ left: "50%", top: "50%" }}>{props.dayName}</Label>
        {props.children}
      </WeekDayDiv>
    </>
  );
};

export default WeekDaySection;
