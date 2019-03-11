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

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange() {
        const hospitalName = document.getElementById("hospital_name").value;
        const hospitalEmail = document.getElementById("hospital_email").value;
        const hospitalPhone = document.getElementById("hospital_phone").value;

        this.props.onChange({hospitalName, hospitalEmail, hospitalPhone});
    }

    render() {
        const content = (
            <>
                <InputCell
                    field={"Name"}
                    value={this.props.hospitalName}
                    id={"hospital_name"}
                    disabled={this.props.localHospital}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Email"}
                    value={this.props.hospitalEmail}
                    id={"hospital_email"}
                    disabled={this.props.localHospital}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Phone"}
                    value={this.props.hospitalPhone}
                    id={"hospital_phone"}
                    disabled={this.props.localHospital}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"This hospital"}
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
