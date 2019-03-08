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

export default class CarerSection extends React.Component {
    render() {
        const content = (
            <>
                <InputCell
                    field={"Carer ID"}
                    value={this.props.carerId}
                    id={"carer_id"}
                    disabled={"true"}
                />

                <InputCell
                    field={"Relationship"}
                    value={this.props.carerRelationship}
                    id={"carer_relationship"}
                />

                <InputCell
                    field={"Name"}
                    value={this.props.carerName}
                    id={"carer_name"}
                />

                <InputCell
                    field={"Surname"}
                    value={this.props.carerSurname}
                    id={"carer_surname"}
                />

                <InputCell
                    field={"Email"}
                    value={this.props.carerEmail}
                    id={"carer_email"}
                />

                <InputCell
                    field={"Phone"}
                    value={this.props.carerPhone}
                    id={"carer_phone"}
                />
            </>
        );
        return (
            <SectionContainer
                title={"Carer info"}
                content={content}
            />
        );
    }
}