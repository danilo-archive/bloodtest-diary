import React from "react";
import styled from "styled-components";

import SearchBar from "./../navbarComponents/searchBar.js"
import ControlButtons from "./../navbarComponents/controlButtons.js"
import WeekButtons from "./../navbarComponents/weekButtons.js"
import NavHeader from "./../navbarComponents/navHeader.js"

import OptionSwitch from "./../switch/OptionSwitch.js"


const Container = styled.div`
  border: red 0px solid;
  padding: 0%;
  width: auto;
  height: 100%;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  align-content: stretch;
`;

const BottomSide = styled.div`
  border: green 0px solid;
  padding: 0%;

  height: 100%;
  width: auto;

  overflow: hidden;

  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

const CalenderControls = styled.div`
  border: green 0px solid;
  padding: 0%;

  height: 100%;
  width: auto;

  margin-right: 1%;

  overflow: hidden;


  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

class Navbar extends React.Component {

  constructor(props){
      super(props);
      this.onPrev = props.onPrev;
      this.onNext = props.onNext;
      this.onPatientsClick = props.onPatientsClick;
      this.onHomeClick = props.onHomeClick;
      this.onSignoutClick = props.onSignoutClick;
  }

  onRefreshClick = () => {
    this.props.refresh();
  };

  render() {
    return (
      <Container>
        <NavHeader onHomeClick = {this.onHomeClick} onRefreshClick = {this.onRefreshClick}/>
        <BottomSide>
          <CalenderControls>
            <SearchBar/>
            <WeekButtons onPrev = {this.onPrev} onNext = {this.onNext}/>
          </CalenderControls>
          <ControlButtons onPatientsClick = {this.onPatientsClick} onSignoutClick = {this.onSignoutClick}/>
        </BottomSide>
      </Container>
    );
  }
}

export default Navbar;
