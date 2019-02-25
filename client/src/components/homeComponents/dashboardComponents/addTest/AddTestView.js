import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";
import DateSelectorSection from "./DateSelectorSection";

const DataContainer = styled.div`
  position: relative;
  width: 100%;
  height: 88%;
  background: rgba(0, 0, 0, 0);
`;
export default class AddTestView extends React.Component {

  render() {
    return (
      <>
          <div
            style={{
              width: "35rem",
              height: "30rem",
              background: "rgba(244, 244, 244,0.7)"
            }}
          >
            <TitleTab onClose={this.props.closeModal} main={true}>
              Add Appointments
            </TitleTab>
            <DataContainer>
              <PatientSelect
                patients={[
                  { name: "John Smith", id: "1740982" },
                  { name: "Juan Mexican", id: "098765" },
                  { name: "El Barto", id: "123456789" },
                  { name: "El Barto", id: "123456789" },
                  { name: "El Barto", id: "123456789" }
                ]}
                onDoneClick={this.props.closeModal}
              />

              <DateSelectorSection />
            </DataContainer>
          </div>
      </>
    );
  }
}
