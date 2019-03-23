import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 10%;
`;

const SearchDiv = styled.div`
  width: 90%;
  height: 80%;
  background: white;
  box-shadow: 1px 1px 10px grey;
  border: 0px;

  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
`;

const Bar = styled.input.attrs({ type: "text" })`
  width: 90%;
  height: 80%;
  margin-left: 0.5rem;
  padding-left: 2%;
  border: solid 0.5px rgba(204, 204, 204, 1);
  font-size: 90%;
  ::-webkit-input-placeholder {
    font-size: 60%;
    color: #b0b0b0;
  }
`;

export default class SearchBar extends React.Component {
  render() {
    return (
      <>
        <Container>
          <SearchDiv>
            <i className="fa fa-search" />
            <Bar
                onChange={event => this.props.onChange(event.target.value)}
                placeholder={"Enter patient name or Id ..."}
            />
          </SearchDiv>
        </Container>
      </>
    );
  }
}
