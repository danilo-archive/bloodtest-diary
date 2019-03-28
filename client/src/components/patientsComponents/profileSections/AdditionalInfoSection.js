/**
 * Class renders additional info for patient.
 * Content of this section is meant to be used and notes and miscellaneous information.
 *
 * @author Jakub Cerven
 */

import React from "react";
import styled from "styled-components";
import SectionContainer from "./SectionContainer";

const TextArea = styled.textarea`
  width:  450px;
  height: 120px;
  margin: 1%;
  resize: none;
  padding: 3%;
  outline: none;
  background: white;
  ::-webkit-scrollbar:vertical {
      display: initial;
    }
`;

export default class AdditionalInfoSection extends React.Component {

    constructor(props) {
        super(props);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange() {
        const additionalInfo = document.getElementById("additional_info_area").value;
        this.props.onChange({additionalInfo});
    }

    render() {
        const content = (
            <>
                <TextArea
                    id={"additional_info_area"}
                    defaultValue={this.props.additionalInfo}
                    placeholder={"(optional)"}
                    onChange={this.onInputChange}
                />
            </>
        );
        return (
            <SectionContainer
                title={"Additional information"}
                content={content}
            />
        );
    }
}
