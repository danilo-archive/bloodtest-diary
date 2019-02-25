import React from "react";
import styled from "styled-components";

const PillDiv = styled.div`
  position: absolute;
  background-color: #0b999d;
  color: white;
  font-family: "Rajdhani", sans-serif;
  transform: translate(-50%, -50%);
  padding: 0% 5% 0% 5%;
  top: 0;
  left: 50%;
`;

export default props => {
  return (
    <>
      <PillDiv>{props.children}</PillDiv>
    </>
  );
};
//  <StatusPill status={props.status}>{props.status}</StatusPill>
