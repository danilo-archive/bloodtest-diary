import React, { Component } from 'react';
import styled from "styled-components";

import ConnectionPanel from './settingsComponents/connectionPanel.js';
import UsersPanel from './settingsComponents/usersPanel.js';
import PrefrencesPanel from './settingsComponents/prefrencesPanel.js';
import Credentials from './settingsComponents/credentials.js';


const Container = styled.div`
  height: auto;
  max-height: calc(100vh - 100px);
  overflow: scroll;
  width: 300px;
`;
const Divider = styled.div`
  display: block;
  margin-before: 0.5em;
  margin-after: 0.5em;
  margin-start: auto;
  margin-end: auto;
  overflow: hidden;
  border: solid 0.5px #0d4e56;
`;

export default class SettingsPanel extends Component {

  getPanel() {
    switch(this.props.currentPage) {
      case undefined:
        return (
          <ConnectionPanel/>
        );
      case 'login_page':
        return (
          <ConnectionPanel/>
        );
      default:
        if (this.props.isAdmin){
          return (
            <>
              <UsersPanel/>
              <Divider />
              <Credentials/>
              <Divider />
              <PrefrencesPanel/>
            </>
          );
        }else{
          return (
            <>
              <Credentials/>
              <Divider />
              <PrefrencesPanel/>
            </>
          )
        }
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
