import React from "react";
import styled from "styled-components";

import arrow from "./../../images/arrow.png";


const Container = styled.div`
  border: red 0px solid;
  padding: 0%;
  width: auto;
  height: auto;
  overflow: hidden;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;

  .controlButtons {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: space-around;
    width: 320px;
    height: 100%;
    overflow: hidden;
  }

  .signOutButton {
    background-color: #55cdd1;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 150px;
    height: 50px;
    border-radius:  0;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin: 5px;
  }
  .patientsButton {
    background-color: #97a9a9;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 150px;
    height: 50px;
    border-radius:  0;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin: 5px;
  }
  .homeButton {
    background-color: #97a9a9;
    color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    width: 150px;
    height: 50px;
    border-radius:  0;
    cursor: pointer;
    border: none;
    outline:none;
    padding: 10px;
    margin: 5px;
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

const Header = styled.div`
  width: auto;
  height: 50px
  margin: 3px;
  padding-left: 15px;
  background-color: #0d4e56;
  align-self: flex-start;
  display: flex;
  text-align: left;
  flex-direction: column;
  justify-content: center;

  font-family: "Rajdhani", sans-serif;
  color: #e2e2d9;
  font-size: 150%;
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
      <Header>Dashboard</Header>
      <Container>
          <div className={"calendarControls"}>
            <div className={"scrollButtons"}>
                <img src={arrow} className={"prevButton"} onClick={this.onPrev} alt={"Previous Date"}/>
                <img src={arrow} className={"nextButton"} onClick={this.onNext} alt={"Next Date"}/>
            </div>
            </div>
            <div className={"controlButtons"}>
                <button className={"homeButton"} onClick={this.onHomeClick}>Home</button>
                <button className={"patientsButton"} onClick={this.onPatientsClick}>Patients</button>
                <button className={"signOutButton"}>Sign Out</button>
            </div>
      </Container>
      </>
    );
  }
}

export default Navbar;
