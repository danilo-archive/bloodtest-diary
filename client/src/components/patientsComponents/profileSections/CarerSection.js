import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer";

export default class CarerSection extends React.Component {
    render() {
        const content = (
            <>
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

                <InputCell
                    field={"Does this patient have carer ?"}
                    value={this.props.hasCarer}
                    id={"has_carer"}
                    type={"checkbox"}
                    onChange={!this.props.hasCarer}
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