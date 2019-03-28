/**
 * This component renders a colour picker.
 * The colour picker is taken from the REACT Colour free licensed library.
 * The colour picker is the standard GitHub colour picker
 * @module ColorPicker
 * @author Jacopo Madaluni
 * @version 0.0.2
 */

import React from 'react';
import { GithubPicker } from 'react-color';
import {getServerConnect} from "./../../../serverConnection.js";
import { openAlert } from '../../Alert.js';

const colours = ['#FFFFFF', '#EB9694', '#FCCB00', '#76F196', '#7BDCcc', '#B8ffff', '#7687F1', '#899aff', 
                 '#F8D4FD', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB']


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
            if (!res.success){this.props.handleError(res)}
        });
    }else{
        this.serverConnect.changeTestColour(this.state.id, color.hex, res2 => {
            if (!res2.success){this.props.handleError(res2)}
        });
    }
  };

  render() {
    return(
        <GithubPicker
            colors = {colours}
            onChangeComplete={ this.handleChangeComplete }
        />
    );
  }
}

export default ColorPicker;
