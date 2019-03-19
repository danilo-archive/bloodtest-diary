import React, { Component } from 'react';
import styled from "styled-components";

import ConnectionPanel from './settingsComponents/connectionPanel.js';
import UsersPanel from './settingsComponents/usersPanel.js';
import PrefrencesPanel from './settingsComponents/prefrencesPanel.js';


const Container = styled.div`
  height: auto;
  width: 300px;
`;

export default class SettingsPanel extends Component {

  getPanel() {
    switch(this.props.currentPage) {
      case 'login_page':
        return (
          <ConnectionPanel/>
        );
      default:
        return (
          <>
            <ConnectionPanel/>
            <hr style={{
              background: "white",
            }}/>
            <UsersPanel/>
            <hr style={{
              background: "white",
            }}/>
            <PrefrencesPanel/>
          </>
        );
    }
  }

  render() {
    const content = this.getPanel();
    return (
      <Container>
        {content}
      </Container>
    )
  }
}
