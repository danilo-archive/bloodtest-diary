import React from "react";
import styled from "styled-components";

import TitleTab from "./TitleTab";
import PatientSelect from "./PatientSelect";

const DataContainer = styled.div`
  width: 100%;
  height: 88%;
  background: rgba(0, 0, 0, 0);
`;
export default class AddTestView extends React.Component {
  state = { open: true };
  close = () => {
    this.setState({ open: false });
  };
  render() {
    return (
      <>
        {this.state.open ? (
          <div
            style={{
              width: "35rem",
              height: "30rem",
              background: "rgba(244, 244, 244,0.7)"
            }}
          >
            <TitleTab onClose={this.close} main={true}>
              Add Appointments
            </TitleTab>
            <DataContainer>
              <PatientSelect
                patients={[
                  { name: "John Smith", id: "1740982" },
                  { name: "Juan Mexican", id: "098765" },
                  { name: "El Barto", id: "123456789" }
                ]}
              />
            </DataContainer>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
