import React from "react";
import styled from "styled-components";

import SearchBar from "./SearchBar";
import TitleTab from "./TitleTab";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

const Container = styled.div`
  height: 100%;
  width: 50%;
  background: rgba(244, 244, 244, 0.7);
  float: right;
  border: solid 1px grey;
`;
const ShowID = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default props => {
  return (
    <Container>
      <TitleTab color="#0b999d">Patient</TitleTab>
      <br />
      <SearchBar />
      <br />
      <ShowID>
        <Label
          style={{
            position: "relative",
            transform: "translate(0,0)",
            margin: "0rem 1rem"
          }}
        >
          Show ID
        </Label>
        <Switch />
      </ShowID>
      <hr />
    </Container>
  );
};
