import React from "react";
import styled from "styled-components";
import Slider from "./Slider";
import LabelAndSelector from "./LabelAndSelector";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default class FrequencySetter extends React.Component {
  state = { timeAmount: this.props.timeAmount, timeUnit: this.props.timeUnit };
  render() {
    return (
      <Container>
        <br />
        <LabelAndSelector
          timeAmount={this.state.timeAmount}
          options={this.props.unitOptions}
          onSelectChange={timeUnit => {
            this.setState({ timeUnit });
            this.props.onSelectChange(timeUnit);
          }}
        />
        <br />
        <Slider
          min="0"
          max="12"
          onChange={value => {
            this.setState({ timeAmount: value });
            this.props.onSliderChange(value);
          }}
        />
      </Container>
    );
  }
}
