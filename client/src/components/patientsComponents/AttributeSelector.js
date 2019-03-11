import React from "react";
import styled from "styled-components";

import AttributeCollapse from "./AttributeCollapse";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MenuItem from 'react-bootstrap/DropdownMenu'

const Container = styled.div`
`;

const Arrow = styled.i`
  border: solid white;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: center;
`;

const Item = styled(Dropdown.Item) `
  width: 100%;
  display: block;
  color: black;
  :hover {
    text-decoration: none;
    background: #f5f5f5;
  }
`;

export default class AttributeSelector extends React.Component {
    render() {
        return (
            <Container>
                /*<AttributeCollapse
                    title={"Patients"}
                    attributes={["Patient Id", "Name", "Surname", "Email", "Phone"]}
                />
                *<AttributeCollapse
                    title={"Carer"}
                    attributes={["Carer Id", "Relationship", "Name", "Surname", "Email", "Phone"]}
                />
                <AttributeCollapse
                    title={"Hospital"}
                    attributes={["Hospital Id", "Name", "Email", "Phone"]}
                />
                <AttributeCollapse
                    title={"Diagnosis"}
                />*/
            </Container>
        );
    }
}