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
                    value={"some value"}
                    id={"hospital_id"}
                    disabled={"true"}
                />

                <InputCell
                    field={"Relationship"}
                    value={"some value"}
                    id={"hospital_id"}
                />

                <InputCell
                    field={"Name"}
                    value={"some value"}
                    id={"hospital_id"}
                />

                <InputCell
                    field={"Surname"}
                    value={"some value"}
                    id={"hospital_id"}
                />

                <InputCell
                    field={"Email"}
                    value={"some value"}
                    id={"hospital_id"}
                />

                <InputCell
                    field={"Phone"}
                    value={"some value"}
                    id={"hospital_id"}
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