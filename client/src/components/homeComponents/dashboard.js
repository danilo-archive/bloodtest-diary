import React, { Component } from 'react';

import styled from "styled-components";
import OverduePatients from "./dashboardComponents/overduePatients";
import WeeklyCalendar from "./dashboardComponents/weeklyCalendar";
import OngoingWeekly from "./dashboardComponents/ongoingWeekly";
import Navbar from "./dashboardComponents/navbar";

import './dashboard.css';

class Dashboard extends Component {

  constructor(props){
      super(props);
      this.state = {
          overdueTests: {}
      };
      this.serverConnect = props.serverConnect;
      this.initOverduePanel();
  }

  initOverduePanel(){
      // TODO get from database
      this.state.overdueTests = this.serverConnect.TESTgetOverdueTests();
  }


  render() {
    return (

      <div className={"dashboard"}>
        <div className={"overduePatients"}>
          <OverduePatients
            notificationNumber={
                this.state.overdueTests.length
            }
            anytimeAppointments={this.state.overdueTests}
          />
        </div>
        <div className={"calendar"}>
          <WeeklyCalendar />
        </div>
        <div className={"test"}>
          <div className={"navbar"}>
            <Navbar />
          </div>
          <div className={"ongoingWeekly"}>
            <OngoingWeekly
              notificationNumber={
                APPOINTMENTS_EXAMPLE_ANYTIME.length +
                APPOINTMENTS_EXAMPLE_SCHEDULED.length
              }
              anytimeAppointments={APPOINTMENTS_EXAMPLE_ANYTIME}
              scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
            />
          </div>
        </div>
      </div>
    );
  }
}

const APPOINTMENTS_EXAMPLE_ANYTIME = [
  {
    status: "completed",
    patientName: "Luka Kralj"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell"
  },
  {
    status: "late",
    patientName: "Danilo del Busso"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini"
  },
  {
    status: "pending",
    patientName: "IDK Who Else To Put"
  },
  {
    status: "completed",
    patientName: "Luka Kralj"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell"
  },
  {
    status: "late",
    patientName: "Danilo del Busso"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini"
  },
  {
    status: "pending",
    patientName: "IDK Who Else To Put"
  },
  {
    status: "completed",
    patientName: "Luka Kralj"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell"
  },
  {
    status: "late",
    patientName: "Danilo del Busso"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini"
  },
  {
    status: "pending",
    patientName: "IDK Who Else To Put"
  }
];

const APPOINTMENTS_EXAMPLE_SCHEDULED = [
  {
    status: "pending",
    patientName: "Luka Kralj",
    time: "09:00"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell",
    time: "12:00"
  },
  {
    status: "late",
    patientName: "Danilo del Busso",
    time: "13:00"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini",
    time: "15:00"
  },
  {
    status: "pending",
    patientName: "Just A Very Long Name To Test This",
    time: "23:30"
  }
];

export default Dashboard;
