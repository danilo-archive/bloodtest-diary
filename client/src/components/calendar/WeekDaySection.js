import React from "react";
import styled from "styled-components";

import NotificationIcon from "./NotificationIcon";
import Label from "../Label";

const WeekDayDiv = styled.div`
  width: 100%;
  height: 11%;
  background-color: #0d4e56;
  display: flex;
  top: 0;
  text-align: center;
  flex-direction: column;
  justify-content: center;
`;
const WeekDaySection = props => {
  return (
    <>
      <WeekDayDiv>
        <NotificationIcon
          text={props.notificationNumber}
          top="15px"
          left="165px"
        />
        <Label fontSize={"30px"}>{props.dayName}</Label>
      </WeekDayDiv>
    </>
  );
};

export default WeekDaySection;
