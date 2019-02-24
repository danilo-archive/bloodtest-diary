import React from "react";
import styled from "styled-components";

/*const Box = */ export default styled.div`
  position: relative;
  width: 80%;
  height: 10%;
  background: white;

  display: flex;
  align-items: center;

  &::after {
    position: absolute;
    top: 100%;
    left: 0;
    background: grey;
    width: 100%;
    height: 100%;
    content: "ID: Helloo";
  }
`;
