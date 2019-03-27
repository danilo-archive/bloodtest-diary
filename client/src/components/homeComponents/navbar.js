import React from "react";
import styled from "styled-components";
import { ModalProvider } from "styled-react-modal";
import Modal from "./../Modal";

import DatePicker from "./../navbarComponents/searchBar.js";
import ControlButtons from "./../navbarComponents/controlButtons.js";
import WeekButtons from "./../navbarComponents/weekButtons.js";
import NavHeader from "./../navbarComponents/navHeader.js";
import Report from "../navbarComponents/Report";
import OptionSwitch from "../switch/OptionSwitch";

const Wrapper = styled.div`
  border: #839595 0 solid;
  background-color: white;
  margin-bottom: 1%;
  padding: 10px 0.5%;
  min-height: 150px;
  max-height: 150px;
  flex-grow: 1;
  flex-shrink: 2;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;
const Container = styled.div`
  border: red 0 solid;
  padding: 0;
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
  border: green 0 solid;
  padding: 0;
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
  border: green 0 solid;
  padding: 0;
  height: 100%;
  width: auto;
  margin-right: 1%;
  margin-left: 1%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const DownloadBox = styled.div`
  height: 100%;
  background: #0b989d;
  padding: 7px 12px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  bottom: 7px;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  color: white;
  font-size: 130%;
  
  :hover {
    background: #018589;
  }
`;

const ControlButton = styled.div`
  position: relative;
  margin-top: 0;
  cursor: pointer;
  outline:none;
  align-self: flex-end;
`;

const patientToggleStyle = {
    position: 'relative',
    bottom: '6px',
};

const modalStyles = {
    border: `solid 0 black`
};

const AddPatientButton = styled.button`
  border: none;
  margin-bottom: 4px;
  margin-right: 2%;
  color: white;
  padding: 7px 12px;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 120%;
  font-weight: 200;
  background-color: #0b989d;
  word-break: break-word;
  outline: none;
  cursor: pointer;
  :hover {
    background: #018589;
  }
`;

class Navbar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            html: undefined,
            openReportModal: false,
        };
    }

    openReportModal = () => {
        this.setState({ openReportModal: true });
    };

    closeReportModal = () => {
        this.setState( { openReportModal: false });
    };

    getNavbar() {
        switch (this.props.page) {
            case "Dashboard":
                return (
                    <ModalProvider>
                        <NavHeader
                            title={this.props.page}
                            onHomeClick={this.props.onHomeClick}
                            onRefreshClick={this.props.refresh}
                        />
                        <BottomSide>
                            <DownloadBox>
                                <ControlButton onClick={this.openReportModal}>Generate&nbsp;report</ControlButton>
                            </DownloadBox>
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
                        <Modal
                            open={this.state.openReportModal}
                            onClose={this.closeReportModal}
                            showCloseIcon={false}
                            style={modalStyles}
                            center
                        >
                            <Report
                                handleError={this.props.handleError}
                                closeModal={this.closeReportModal}
                            />
                        </Modal>
                    </ModalProvider>
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
                            <AddPatientButton onClick={this.props.openAddModal}>Add patient</AddPatientButton>
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
