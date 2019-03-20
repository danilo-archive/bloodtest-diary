import React from "react";
import styled from "styled-components";

import SearchBar from "./../navbarComponents/searchBar.js";
import ControlButtons from "./../navbarComponents/controlButtons.js";
import WeekButtons from "./../navbarComponents/weekButtons.js";
import NavHeader from "./../navbarComponents/navHeader.js";
import OptionSwitch from "../switch/OptionSwitch";

import { openAlert } from "./../Alert.js";

const Container = styled.div`
  border: red 0px solid;
  padding: 0%;
  width: auto;
  height: 100%;

  margin: 3px;

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
  constructor(props) {
    super(props);
  }

  getNavbar() {
    switch (this.props.page) {
      case "Dashboard":
        return (
          <>
            <NavHeader
              title={this.props.page}
              onHomeClick={this.props.onHomeClick}
              onRefreshClick={this.props.refresh}
            />
            <BottomSide>
              <CalenderControls>
                <OptionSwitch
                  checked={this.props.over12}
                  onChange={this.props.setUnder12}
                  option1="Show under 12"
                  option2="Show 12 or older"
                />
                <SearchBar />
                <WeekButtons
                  onPrev={this.props.onPrev}
                  onNext={this.props.onNext}
                />
              </CalenderControls>
              <ControlButtons
                page={this.props.page}
                onPatientsClick={this.props.onPatientsClick}
                onSignoutClick={this.props.onSignoutClick}
              />
            </BottomSide>
          </>
        );
      case "Patients":
        return (
          <>
            <NavHeader
              title={this.props.page}
              onHomeClick={this.props.onHomeClick}
              onRefreshClick={this.props.refresh}
            />
            <BottomSide>
              <OptionSwitch
                checked={this.props.over12}
                onChange={this.props.setUnder12}
                option1="Show under 12"
                option2="Show 12 or older"
              />
              <ControlButtons
                page={this.props.page}
                onPatientsClick={this.props.onPatientsClick}
                onSignoutClick={this.props.onSignoutClick}
              />
            </BottomSide>
          </>
        );
      default:
        return null;
    }
  }

  render() {
    const content = this.getNavbar();
    return <Container>{content}</Container>;
  }
}

export default Navbar;
