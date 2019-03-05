import React from "react";
import styled from "styled-components";
import InfoBox from "./InfoBox";
import TitleTab from "../addTest/TitleTab.js";
import CalendarTable from "../../calendarComponents/Calendar";
import {getServerConnect} from "../../../serverConnection.js";

const DataContainer = styled.div`
  position: relative;
  width: 45rem;
  height: 80px;
  background: rgba(0, 0, 0, 0);
`;

export default class EditTestView extends React.Component {



  constructor(props){
      super(props);
      this.serverConnect = getServerConnect();
      this.state = {
        /*patient: { name: this.props.patient.name, id: this.props.patient.id },
        test: {
          id: this.props.test.id,
          date: {
            dueDate: this.props.test.date.dueDate,
            frequency: this.props.test.date.frequency,
            occurrences: this.props.test.date.occurrences
          },
          status: this.props.test.status
        },
        showCalendar: false*/
        ready: false
    };
    this.init();

  }

  init(){
      this.serverConnect.getMockTest(this.props.testId, res => {
          console.log({res});
         this.setState({
             patient: {name: res.patient_name, id: res.patient_no},
             test: {
                 id: res.test_id,
                 date: {
                     dueDate: res.due_date,
                     frequency: res.frequency,
                     occurrences: res.occurrences
                 },
                 status: res.completed_status
             },
             showCalendar: false,
             ready: true
         });
      });
  }


  render() {
    console.log(this.state);
    if (this.state.ready){
        console.log("ready");
        return (
          <>
            <div
              style={{
                width: "35rem",
                height: "30rem",
                background: "rgba(244, 244, 244,0.7)",
                position: "relative"
              }}
            >
              <TitleTab main={true}>Edit Appointment</TitleTab>
              <div style={{ padding: "1rem 1rem" }}>
                <InfoBox
                  label={"Full Name"}
                  text={this.state.patient.name}
                  icon="arrow-circle-right"
                  onClick={() => {
                    alert("This is supposed to open the patient view");
                  }}
                />
                {this.state.showCalendar ? (
                  <CalendarTable
                    style={{ width: "50%", top: "15%", left: "63%" }}
                    onDaySelected={day => {
                      console.log(`Selected day ${day}`);
                      this.setState({
                        showCalendar: false,
                        test: {
                          ...this.state.test,
                          date: {
                            ...this.state.test.date,
                            dueDate: day
                          }
                        }
                      });
                    }}
                  />
                ) : (
                  ``
                )}
                <InfoBox
                  label={"Due"}
                  text={this.state.test.date.dueDate}
                  icon="edit"
                  onClick={() => this.setState({ showCalendar: true })}
                />
              </div>
            </div>
          </>
        );
    }else{
        return ("");
    }
  }
}
