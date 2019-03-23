import React from "react";
import styled from "styled-components";

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
  return (
    <>
      <PillDiv className="pill">{props.children}</PillDiv>
    </>
  );
};
//  <StatusPill status={props.status}>{props.status}</StatusPill>
