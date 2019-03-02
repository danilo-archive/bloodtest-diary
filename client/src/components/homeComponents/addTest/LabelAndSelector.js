import React from "react";
import styled from "styled-components";

import Label from "../../Label";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
  white-space: nowrap;
`;
const Text = styled(Label)`
  position: relative;
  margin: 0 1rem;

  color: #0d4e56;
  transform: translate(0, 0);
`;

const Select = styled.select`
  position: relative;
  transfrom: translate(0%, 0%);

  top: 0;
`;
export default props => {
  return (
    <Container>
      <Text>
        {props.timeAmount === "0"
          ? "Do not repeat"
          : `Repeat every ${props.timeAmount}`}
      </Text>

      {props.timeAmount !== "0" ? (
        <Select onChange={event => props.onSelectChange(event.target.value)}>
          {props.options.map(option => {
            return <option value={option}>{option}</option>;
          })}
        </Select>
      ) : (
        ""
      )}
    </Container>
  );
};
