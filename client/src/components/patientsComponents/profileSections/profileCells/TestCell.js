import React from "react";
import styled from "styled-components";
import InfoCell from "./InfoCell.js";

const Container = styled.div`
  display: flex;
  border: #839595 1px solid;
  border-radius: 10px;
  margin: 1.5%;
`;

const Field = styled.div`
  position: relative;
  padding-left: 1%;
  width: 30%;
  min-width: 10%;
  margin: 0 2.5%;
  height: 100%;
  color: inherit;
  font-family: "Rajdhani", sans-serif;
  font-size: ${props => props.fontSize ? props.fontSize : "200%"};
  overflow: scroll;
  display:flex;
  align-items: center;
`;

const DeleteButton = styled.div`
    background: red;
    width: 50px;
    height: 30px;
    margin-top: 10px;
    margin-left: 22%;
    margin-right: .2%;
    border-radius: 10px;
`;


export default class TestCell extends React.Component {
    render() {
        return (
          <>
            <Container >
                <Field key={"due"} fontSize={"150%"}>{this.props.due}</Field>
                <Field key={"notes"} fontSize={"150%"}>{this.props.notes}</Field>
                <DeleteButton />
            </Container>
          </>
        );
    }
}
