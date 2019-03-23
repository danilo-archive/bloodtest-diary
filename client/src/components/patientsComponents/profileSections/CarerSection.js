import React from "react";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer";

export default class CarerSection extends React.Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange() {
        const carerRelationship = document.getElementById("carer_relationship").value;
        const carerName = document.getElementById("carer_name").value;
        const carerSurname = document.getElementById("carer_surname").value;
        const carerEmail = document.getElementById("carer_email").value;
        const carerPhone = document.getElementById("carer_phone").value;

        this.props.onChange({carerRelationship, carerName, carerSurname, carerEmail, carerPhone});
    }

    render() {
        const content = (
            <>
                <InputCell
                    field={"Relationship"}
                    value={this.props.carerRelationship}
                    id={"carer_relationship"}
                    disabled={this.props.noCarer}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Name"}
                    value={this.props.carerName}
                    id={"carer_name"}
                    disabled={this.props.noCarer}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Surname"}
                    value={this.props.carerSurname}
                    id={"carer_surname"}
                    disabled={this.props.noCarer}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Email"}
                    value={this.props.carerEmail}
                    id={"carer_email"}
                    disabled={this.props.noCarer}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"Phone"}
                    value={this.props.carerPhone}
                    id={"carer_phone"}
                    disabled={this.props.noCarer}
                    onChange={this.onInputChange}
                />

                <InputCell
                    field={"No carer"}
                    value={this.props.noCarer}
                    id={"has_carer"}
                    type={"checkbox"}
                    onChange={this.props.onCarerClick}
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
