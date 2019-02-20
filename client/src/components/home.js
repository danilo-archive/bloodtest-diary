import React, { Component } from 'react';
import Header from './header.js';
import './home.css';
import {getServerConnect} from "../serverConnection.js";

class Home extends Component {

  constructor(props){
      super(props);
      this.serverConnect = getServerConnect();
      this.serverConnect.joinMainPage();
  }

  render() {
    return (
      <div>
        <Header />
        <h1>Hello</h1>
      </div>

    );
  }
}

export default Home;
