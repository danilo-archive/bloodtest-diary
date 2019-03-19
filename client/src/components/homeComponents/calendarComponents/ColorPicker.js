import React from 'react';
import { GithubPicker } from 'react-color';

class ColorPicker extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          testId: props.testId,
      }
  }

  handleChangeComplete = (color) => {
    console.log(`test: ${this.state.testId}, color: ${color.hex}`);
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
