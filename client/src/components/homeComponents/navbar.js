import React from "react";
import styled from "styled-components";

import arrow from "./../../images/arrow.png";


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


  .signOutButton {
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

  .patientsButton {
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

  .homeButton {
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

  .signOutButton:focus,
  .signOut:hover {
    background-color: #0b989d;
  }

  .patientsButton:focus,
  .patients:hover {
    background-color: #abbdbd;
  }

  .homeButton:focus,
  .home:hover {
    background-color: #abbdbd;
  }

  .scrollButtons {
    background-color: #f4f9fd;
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

  constructor(props){
      super(props);
      this.onPrev = props.onPrev;
      this.onNext = props.onNext;
      this.onPatientsClick = props.onPatientsClick;
      this.onHomeClick = props.onHomeClick;
  }


  render() {
    return (
      <>
      <Container>
          <div className={"controlButtons"}>
            <button className={"homeButton"} onClick={this.onHomeClick}>Home</button>

            <button className={"patientsButton"} onClick={this.onPatientsClick}>Patients</button>

            <button className={"signOutButton"}>Sign Out</button>
          </div>
          <div className={"calendarControls"}>
            <div className={"scrollButtons"}>
                <img src={arrow} className={"prevButton"} onClick={this.onPrev} alt={"Previous Date"}/>
                <img src={arrow} className={"nextButton"} onClick={this.onNext} alt={"Next Date"}/>
            </div>
          </div>
      </Container>
      </>
    );
  }
}

export default Navbar;
