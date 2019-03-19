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

  constructor(props){
      super(props);
      this.state = {
        currentPage: this.props.currentPage,
      }
  }

  getPanel() {
    switch(this.state.currentPage) {
      case 'login_page':
        return (
          <ConnectionPanel/>
        );
      default:
        return (
          <>
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
