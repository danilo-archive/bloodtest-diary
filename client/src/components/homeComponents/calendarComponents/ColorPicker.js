import React from 'react';
import { GithubPicker } from 'react-color';
import {getServerConnect} from "./../../../serverConnection.js";

class ColorPicker extends React.Component {

  constructor(props){
      super(props);
      this.serverConnect = getServerConnect();
      this.state = {
          testId: props.testId,
      }
  }

  handleChangeComplete = (color) => {
    console.log(`test: ${this.state.testId}, color: ${color.hex}`);
    this.serverConnect.changePatientColour(this.state.testId, color.hex, res => {
        console.log({res});
    });
  };

  render() {
    return(
        <GithubPicker
            onChangeComplete={ this.handleChangeComplete }
        />
    );
  }
}

export default ColorPicker;
