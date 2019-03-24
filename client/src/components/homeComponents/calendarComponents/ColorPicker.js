import React from 'react';
import { GithubPicker } from 'react-color';
import {getServerConnect} from "./../../../serverConnection.js";
import { openAlert } from '../../Alert.js';

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
    if (this.state.type === "patient"){
        this.serverConnect.changePatientColour(this.state.id, color.hex, res => {
            if (!res.success){openAlert("Something went wrong", "confirmationAlert", "ok", () => {return})}
        });
    }else{
        this.serverConnect.changeTestColour(this.state.id, color.hex, res => {
            if (!res.success){openAlert("Something went wrong", "confirmationAlert", "ok", () => {return})}
        });
    }
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
