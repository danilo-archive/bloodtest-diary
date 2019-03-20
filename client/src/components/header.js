import React, { Component } from 'react';
import styled from "styled-components";

import '../styles/header.css';

import minimize from "../images/minimize.png"
import maximize from "../images/maximize.png"
import close from "../images/close.png"
import settings from "../images/settings.png"
import OfflineScreen from "./OfflineScreen.js";
import SettingsPanel from "./SettingsPanel.js";
import {getServerConnect} from "../serverConnection.js";

import Alert from "./Alert.js"


class Header extends Component {
  constructor(props){
      super(props);
      this.serverConnect = getServerConnect();
      this.state = {
          disabled: true,
          currentPage: undefined
      }
      this.serverConnect.setOnConnect( () => {
         this.setState({disabled: false});
      });
      this.serverConnect.setOnDisconnect( () => {
         this.setState({disabled: true});
      });
      this.serverConnect.setOnRoomJoin(room => {
         this.setPage(room);
      });

  }

  /**
  * @param {String} room : possible rooms: login_page, main_page, patients_page
  */
  setPage = room => {
     this.setState({currentPage: room});
  }

  safeClose = event => {
      this.serverConnect.logout(res=>{return});
  }

  render() {
    return (
    <>
      <header id="titlebar">
          <div id="window-title">
            <span>Kings College London NHS</span>
          </div>
           <div id="window-controls">
               <div className="dropdown">
                   <div className="button" id="settings-button">
                       <img className={"headerIcon"} src={settings} alt={"Settings Button"}/>
                   </div>
                   <div className="dropdown-content">
                    <SettingsPanel currentPage={this.state.currentPage}/>
                  </div>
               </div>
               <div className="button" id="min-button">
                   <img className={"headerIcon"} src={minimize} alt={"Minimize Button"}/>
               </div>
              <div className="button" id="max-button">
                  <img className={"headerIcon"} src={maximize} alt={"Maximize Button"}/>
              </div>
              <div className="button" id="close-button">
                  <img onClick={this.safeClose} className={"headerIcon"} src={close} alt={"Close Button"}/>
              </div>
          </div>
      </header>
      <OfflineScreen disabled = {this.state.disabled}/>
      <Alert/>
      </>
    );
  }
}

export default Header;
