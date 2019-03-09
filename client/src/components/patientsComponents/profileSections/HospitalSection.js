import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer";

const Container = styled.div`
  margin: 1% 10%;
  padding: 1%;
  border: #839595 3px solid;
  border-radius: 10px;
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  background: white;
`;

class HospitalSection extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const content = (
            <>
                <InputCell
                    field={"Name"}
                    value={this.props.hospitalName}
                    id={"hospital_name"}
                    disabled={this.props.localHospital}
                />

                <InputCell
                    field={"Email"}
                    value={this.props.hospitalEmail}
                    id={"hospital_email"}
                    disabled={this.props.localHospital}
                />

                <InputCell
                    field={"Phone"}
                    value={this.props.hospitalPhone}
                    id={"hospital_phone"}
                    disabled={this.props.localHospital}
                />

                <InputCell
                    field={"Is this patient in local hospital ?"}
                    value={this.props.localHospital}
                    id={"is_local"}
                    type={"checkbox"}
                    onChange={this.props.onHospitalClick}
                />
            </>
        );
        return (
            <SectionContainer
                title={"Hospital info"}
                content={content}
            />
        );
    }
}

export default HospitalSection;

