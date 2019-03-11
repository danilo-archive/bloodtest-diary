import React from "react";
import styled from "styled-components";

const ButtonDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
  background: #0b999d;
  border-radius: 0px 5px 5px 0px;
  padding: 0;
  top: 0%;
  bottom: 0%;
  right: 0%;
  font-size: 35px;
  color: white;
  transition: 250ms;
  cursor: pointer;

  &:hover {
    background: #08797c;
  }
  &:active {
    background: #05595b;
  }
`;

export default ButtonDiv;
