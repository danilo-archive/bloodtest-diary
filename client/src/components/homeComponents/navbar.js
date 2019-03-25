import React from "react";
import styled from "styled-components";

import DatePicker from "./../navbarComponents/searchBar.js";
import ControlButtons from "./../navbarComponents/controlButtons.js";
import WeekButtons from "./../navbarComponents/weekButtons.js";
import NavHeader from "./../navbarComponents/navHeader.js";
import OptionSwitch from "../switch/OptionSwitch";

const Wrapper = styled.div`
  border: #839595 0px solid;

  background-color: white;

  margin-bottom: 1%;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 0.5%;
  padding-right: 0.5%;

  min-height: 150px;
  max-height: 150px;

  flex-grow: 1;
  flex-shrink: 2;

  overflow: hidden;

  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;
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

const patientToggleStyle = {
  position: 'relative',
  bottom: '10px',
};

class Navbar extends React.Component {
  
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
                  option1="Under 12"
                  option2="12 or older"
                />
                <DatePicker onDayPick={this.props.onDayPick}/>
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
                option1="Under 12"
                option2="12 or older"
                style={patientToggleStyle}
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
    return (
      <Wrapper>
        <Container>
          {content}
        </Container>
      </Wrapper>
    );
  }
}

export default Navbar;
