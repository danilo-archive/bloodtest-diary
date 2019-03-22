import React from 'react';
import { GithubPicker } from 'react-color';
import {getServerConnect} from "./../../../serverConnection.js";

class ColorPicker extends React.Component {

  constructor(props){
      super(props);
      this.serverConnect = getServerConnect();
      this.state = {
          id: props.id,
          type: props.type
      }
  }

  handleChangeComplete = (color) => {
    console.log(`test: ${this.state.id}, color: ${color.hex}`);
    if (this.state.type === "patient"){
        this.serverConnect.changePatientColour(this.state.id, color.hex, res => {
            console.log({res});
        });
    }else{
        this.serverConnect.changeTestColour(this.state.id, color.hex, res => {
            console.log({res});
        });
    }
  };

  render() {
    console.log(this.state.id);
    console.log(this.state.type);  
    return(
        <GithubPicker
            onChangeComplete={ this.handleChangeComplete }
        />
    );
  }
}

export default ColorPicker;
