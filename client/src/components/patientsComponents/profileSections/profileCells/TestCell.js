import React from "react";
import styled from "styled-components";
import dateformat from "dateformat";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: row;
    border-radius: 5px;
    background: #eeeeee;
    :hover {
      background: #f2f2f2;
    }
`;

const Field = styled.div`
  position: relative;
  width: 50%;
  min-width: 10%;
  margin: 0 2.5%;
  height: 100%;
  color: inherit;

  font-size: 125%;
  overflow: scroll;
  display: flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;

`;

const FieldText = styled.p`
  margin: 0;
  //TODO: Fix this
  margin-top: 6px;
  max-height: 30px;
`;

const DeleteButton = styled.button`
  border: none;
  background-color: #f44336;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  margin-left: auto;
  margin-right: 0;

  :hover {
    background-color: #dc2836;
  }
  outline: none;
`;


export default class TestCell extends React.Component {
    render() {
        return (
            <>
                <Container>
                    <Field key={"due"} fontSize={"150%"}><FieldText>{dateformat(this.props.due, "dS mmm yyyy")}</FieldText></Field>
                    <Field key={"notes"} fontSize={"150%"}><FieldText>{this.props.notes}</FieldText></Field>
                    <DeleteButton onClick={() => {this.props.deleteTest(this.props.testId)}}>Delete test</DeleteButton>
                </Container>
            </>
        );
    }
}
