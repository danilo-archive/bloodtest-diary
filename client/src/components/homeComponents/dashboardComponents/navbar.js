import React from "react";
import styled from "styled-components";

import arrow from "./../../../images/arrow.png";

import Dashboard from "./../dashboard.js";

const Container = styled.div`

  border: red 0px solid;
  margin: 3px;
  padding: 8px;
  width: auto;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-content: flex-end;


  .signOut {
    background-color: #55cdd1;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 150px;
    border-radius:  0.25rem;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin: 10px;

  }

  .patients {
    background-color: #97a9a9;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 150px;
    border-radius:  0.25rem;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin: 10px;

  }

  .home {
    background-color: #97a9a9;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 150px;
    border-radius:  0.25rem;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin: 10px;

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

  .scrollButtons {
    padding: 4px;
    width: 100px;


  }

  .prevButton {
    width: 50%;
    cursor: pointer;
  }


  .nextButton {
    width: 50%;
    cursor: pointer;
    transform: rotate(180deg);
  }

`;

class Navbar extends React.Component {
  render() {
    return (
      <>
      <Container>

          <div className={"controlButtons"}>
            <button className={"home"}>Home</button>

            <button className={"patients"}>Patients</button>

            <button className={"signOut"}>Sign Out</button>
          </div>
          <div className={"calanderControls"}>
            <div className={"scrollButtons"}>
                <img src={arrow} className={"prevButton"} onClick={Dashboard.handlePrevious} alt={"Previous Date"}/>
                <img src={arrow} className={"nextButton"} onClick={Dashboard.handleNext} alt={"Next Date"}/>
            </div>
          </div>
      </Container>
      </>
    );
  }
}

export default Navbar;
