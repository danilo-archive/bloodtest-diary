import React, { Component } from 'react';
import styled from "styled-components";

import ConnectionPanel from './settingsComponents/connectionPanel.js';
import UsersPanel from './settingsComponents/usersPanel.js';
import PrefrencesPanel from './settingsComponents/prefrencesPanel.js';


const Container = styled.div`
  height: auto;
  width: 300px;

  divider {
    display: block;
    margin-before: 0.5em;
    margin-after: 0.5em;
    margin-start: auto;
    margin-end: auto;
    overflow: hidden;
    border: solid 0.5px #0d4e56;
  }
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
            <UsersPanel/>
            <divider />
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
