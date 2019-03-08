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
    justify-content: center;
`;


export default class TestSection extends React.Component {
    render() {
        const content = (
            <>
                Will contain some test data
            </>
        );

        return (
            <SectionContainer
            title={"Test data"}
            content={content}
            />
        );
    }
}