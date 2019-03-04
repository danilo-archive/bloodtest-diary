import React, { Component } from 'react';
import styled from "styled-components";

import './header.css';

import minimize from "../images/minimize.png"
import maximize from "../images/maximize.png"
import close from "../images/close.png"
import settings from "../images/settings.png"


const navbarIcons = styled.div`
    .icon {
    max-width:100%;
    max-height:100%;
    }
`;

class Header extends Component {
  render() {
    return (
      <header id="titlebar">
          <div id="window-title">
            <span>King's College London NHS</span>
          </div>
          <div className={navbarIcons}>
           <div id="window-controls">
               <div className="dropdown">
                   <div className="button" id="settings-button">
                       <img className={"icon"} src={settings} alt={"Settings Button"}/>
                   </div>
                   <div class="dropdown-content">
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                  </div>
               </div>
               <div className="button" id="min-button">
                   <img className={"icon"} src={minimize} alt={"Minimize Button"}/>
               </div>
              <div className="button" id="max-button">
                  <img className={"icon"} src={maximize} alt={"Maximize Button"}/>
              </div>
              <div className="button" id="close-button">
                  <img className={"icon"} src={close} alt={"Close Button"}/>
              </div>
          </div>
        </div>

      </header>
    );
  }
}

export default Header;
