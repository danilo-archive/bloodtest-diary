import React from "react";
import styled from "styled-components";

import Label from "../../Label";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
  white-space: nowrap;
  aling-items: center;
`;
const Text = styled(Label)`
  position: relative;
  margin: 0 1rem;

  color: #0d4e56;
  transform: translate(0, 0);
`;
const Input = styled.input`
  width: 20%;
`;

const Select = styled.select``;
export default props => {
  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Text>
            <>
              Repeat every{"  "}
              <Input
                type="text"
                onChange={event => props.onValueChange(event.target.value)}
              />
            </>
          </Text>
          <Select onChange={event => props.onSelectChange(event.target.value)}>
            {props.options.map(option => {
              return <option value={option}>{option}</option>;
            })}
          </Select>
        </div>
        <Text>
          <>
            Repeat{" "}
            <Input
              type="text"
              onChange={event => props.onOccurrenceChange(event.target.value)}
            />{" "}
            times
          </>
        </Text>
      </div>
    </Container>
  );
};
