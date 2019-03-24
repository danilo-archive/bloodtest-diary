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
  border: 0px;

  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
`;

const Bar = styled.input.attrs({ type: "text" })`
  width: 90%;
  height: 80%;
  margin-left: 1rem;
  border: solid 0.5px rgba(204, 204, 204, 1);
`;

export default class SearchBar extends React.Component {
  render() {
    return (
      <>
        <Container>
          <SearchDiv>
            <i className="fa fa-search" />
            <Bar onChange={event => this.props.onChange(event.target.value)} 
                  placeholder={"Start typing..."}
            />
          </SearchDiv>
        </Container>
      </>
    );
  }
}
