import React, { Component } from 'react';
import './header.css';

class Header extends Component {
  render() {
    return (
      <header id="titlebar">
          <div id="window-title">
            <span>King's College London NHS</span>
          </div>
           <div id="window-controls">
               <div class="button" id="min-button">
                 <span>&#xE921;</span>
              </div>
              <div class="button" id="max-button">
                <span>&#xE922;</span>
              </div>
              <div class="button" id="close-button">
                <span>&#xE8BB;</span>
              </div>
          </div>

      </header>
    );
  }
}

export default Header;
