import React from "react";
import styled from "styled-components";

import DatePicker from "./../navbarComponents/searchBar.js";
import ControlButtons from "./../navbarComponents/controlButtons.js";
import WeekButtons from "./../navbarComponents/weekButtons.js";
import NavHeader from "./../navbarComponents/navHeader.js";
import OptionSwitch from "../switch/OptionSwitch";
import { getServerConnect } from "../../serverConnection.js";
import DownloadLink from "react-download-link";
import dateformat from "dateformat";

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

const DownloadBox = styled.div`
  height: 100%;
  width: 30%;
  position: relative;
  bottom: 7px
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  
  color: #646464;
  font-size: 130%;
  
`;

const ControlButton = styled.div`
  position: relative;
  margin-top: "0"
  border: solid 0px #97a9a9;
  background-color: ;
  width: auto;
  height: 31px;
  margin-right:44px;
  cursor: pointer;
  outline:none;
  align-self: flex-end;
  :hover{
    color: black;
  }
`;

const ControlLabel = styled.div`
  position: relative;
  margin-top: ${props => props.marginTop ? props.marginTop : "0"}
  border: solid 0px #97a9a9;
  background-color: ;
  color: black;
  width: 170px;
  height: 31px;
  margin-right:44px;
  cursor: pointer;
  outline:none;
  align-self: flex-end;
`;

const patientToggleStyle = {
  position: 'relative',
  bottom: '6px',
};

const buttonStyle = {
  position: "relative",
  "margin": "0 10px 0 0",
  border: 'solid 0px #97a9a9',
  'background-color': '',
  width: 'auto',
  height: '31px',
  cursor: 'pointer',
  outline:'none',
  'align-self': 'flex-end',
  color: '#646464',
  ':hover':{
    color: 'black'
  }
}

class Navbar extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      html: undefined
    }
  }

  onDownloadClick = () => {
    this.setState({
      html: undefined
    });
  }

  onGenerateClick = () => {
    let this_ = this;
    getServerConnect().generateMonthlyReport("March", (res) => {
      const time = dateformat(new Date(), "HH:MM:ss");
      if (res.success) {
        this_.setState({
          html: res.html,
          time: time
        });
      }
      else {
        console.log(res);
      }
    });
  }

  getDownloadButton = () => {
    if (this.state.html === undefined) {
      return (
        <DownloadBox>
        <ControlButton onClick={this.onGenerateClick}>Generate&nbsp;report</ControlButton>
        </DownloadBox>
      );
    }
    else {
      return (
        <DownloadBox>
            <ControlLabel>Report&nbsp;generated&nbsp;({this.state.time}):</ControlLabel>
            <DownloadLink
                style={buttonStyle}
                filename="Monthly_Report.html"
                exportFile={() => this.state.html}>      
            </DownloadLink>
            <ControlButton onClick={this.onGenerateClick}>Generate&nbsp;new</ControlButton>
        </DownloadBox>
      );
    }
  }

  getNavbar() {
    const download = this.getDownloadButton();
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
              {download}
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
                onDownloadClick={this.props.onDownloadClick}
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
