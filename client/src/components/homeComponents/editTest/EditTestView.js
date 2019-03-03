import React from "react";
import styled from "styled-components";
import InfoBox from "./InfoBox";
import TitleTab from "../addTest/TitleTab.js";


const DataContainer = styled.div`
  position: relative;
  width: 45rem;
  height: 80px;
  background: rgba(0, 0, 0, 0);
`;

export default class AddTestView extends React.Component {



    render(){
        return (
            <DataContainer>
                <TitleTab main={true}>
                  Edit Appointment
                </TitleTab>
                <InfoBox
                    label = {"Full Name"}
                    text = {"Luka Kralj"}
                />
                <InfoBox
                    label = {"Full Name"}
                    text = {"Alvaro Raussel"}
                />
           </DataContainer>
        );
    }


}
