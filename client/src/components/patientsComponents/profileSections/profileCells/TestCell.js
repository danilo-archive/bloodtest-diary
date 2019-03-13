import React from "react";
import styled from "styled-components";
import InfoCell from "./InfoCell.js";

const Container = styled.div`
  display: flex;
  border: #ccc 1px solid;
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
  font-size: 125%;
  overflow: scroll;
  display:flex;
  align-items: center;
`;

const DeleteButton = styled.button`
  border: none;
  background-color: #f44336;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  margin-left: auto;
  margin-right: 0;

  :hover {
    background-color: #dc2836;
    color: white;
    border-radius: 10px;
  }
  outline: none;
`;


export default class TestCell extends React.Component {
    render() {
        return (
          <>
            <Container >
                <Field key={"due"} fontSize={"150%"}>{this.props.due}</Field>
                <Field key={"notes"} fontSize={"150%"}>{this.props.notes}</Field>
                <DeleteButton>Delete test</DeleteButton>
            </Container>
          </>
        );
    }
}
