import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    margin: 1.5%;
    justify-content: center;
    align-content: center;
    flex-direction: row;
    border: #ccc 1px solid;
    border-radius: 10px;
`;

const Field = styled.div`
  position: relative;
  padding-left: 1%;
  width: 30%;
  min-width: 10%;
  margin: 0 2.5%;
  height: 100%;
  color: inherit;
  
  font-size: 125%;
  overflow: scroll;
  display:flex;
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
                <DeleteButton onClick={() => {this.props.deleteTest(this.props.testId)}}>Delete test</DeleteButton>
            </Container>
          </>
        );
    }
}
