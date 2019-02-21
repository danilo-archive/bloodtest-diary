import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 3px;
  padding: 8px;
  width: 90%;
  height: 100%;
`;

class Navbar extends React.Component {
  render() {
    return (
      <>
      <Container>
        <Button>
          <button id="button" className={"home"}>Home</button>

          <button id="button" className={"patients"}>Patients</button>

          <button id="button" className={"signOut"}>Sign Out</button>
        </Button>
      </Container>
      </>
    );
  }
}

export default Navbar;

const Button = styled.div`
  .signOut {
    background-color: #55cdd1;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 100%;
    border-radius:  0.25rem;
    padding: 1rem;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin-top: 100px;
  }

  .patients {
    background-color: #97a9a9;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 100%;
    border-radius:  0.25rem;
    padding: 1rem;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin-top: 10px;
  }

  .home {
    background-color: #97a9a9;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 100%;
    border-radius:  0.25rem;
    padding: 1rem;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin-top: 10px;
  }

  .signOut:focus,
  .signOut:hover {
    background-color: #0b989d;
  }

  .patients:focus,
  .patients:hover {
    background-color: #abbdbd;
  }

  .home:focus,
  .home:hover {
    background-color: #abbdbd;
  }

`;
