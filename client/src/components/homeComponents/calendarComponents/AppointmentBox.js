import React from "react";
import styled from "styled-components";
import StatusCircle from "./StatusCircle";
import AppointmentInfo from "./AppointmentInfo";
import IconSet from "./IconSet";
import TimePill from "./TimePill";
import {getServerConnect} from "../../../serverConnection.js";
import {isPastDate} from "../../../lib/calendar-controller.js";
import { DragSource } from "react-dnd";

const serverConnect = getServerConnect();
const Container = styled.div`
  opacity: ${props => props.isDragging ? 0 : 1}
  display: block;
  position: relative;
  background-color: ${props => (props.tentative ? `#c1c1c1` : `white`)};
  margin-top: 0;
  margin-bottom: 0;
  margin: 2.5%;
  padding: 0%;
  height: 14%;
  border: solid 1px rgb(100, 100, 100, 0);
  border-radius: 5px;
  display: flex;
  align-items: center;
  z-index: 3;
  & .pill {
    opacity: 0;
    transition: opacity 150ms;
  }
  ${props =>
    props.tentative
      ? ``
      : `&:hover {
    border: solid 1px rgb(100, 100, 100, 0.2);
    }`}

  ${props =>
    props.tentative
      ? `
      & *{
        background-color: ${props => (props.tentative ? `grey` : `white`)};
        color: white!important;
        transition-property:none;

        &:hover {
          opacity:1 !important;
        }
      }
      &:hover {
        & .pill {
          opacity:1;
        }
      }

        `
      : ``}
`;

const mapping = {
    "yes":"completed",
    "no": "pending",
    "in review": "inReview"
}

const spec = {
  beginDrag(props){
    return {
      type: 'appointment',
      testId: props.id
    };
  },
  endDrag(props, monitor, component){
    const newDate = monitor.getDropResult().newDate;
    if (newDate){
      serverConnect.changeTestDueDate(props.id, monitor.getDropResult().newDate);
    }
    //return props.handleDrop(props.id);
  }
}

function collect(connect, monitor){
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()

  }
}

class AppointmentBox extends React.Component {
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
  }


  formatStatus(status, date){
      if (status === "no" && isPastDate(date)){
          return "late";
      }
      if (status === "completed" || status === "inReview" || status === "late"){
         return status;
     } else {
         return mapping[status];
     }

  }

  onStatusClick = status => {
    this.serverConnect.changeTestStatus(this.props.id, status);
  };

  render() {
    const {isDragging, connectDragSource} = this.props;
    return connectDragSource(
      <div>
        <Container isDragging={isDragging} tentative={this.props.tentative}>
          {this.props.tentative ? <TimePill status={this.props.type}>Tentative</TimePill> : ``}

          <StatusCircle
            type={this.props.tentative ? "tentative" : this.formatStatus(this.props.type,  this.props.dueDate)}
          />
          <AppointmentInfo name={this.props.name} />
          <IconSet
              onStatusClick={this.props.tentative ? () => {} : this.onStatusClick}
              editTest={this.props.editTest}
              testId={this.props.id}
          />
        </Container>
      </div>
    );
  }
}

export default DragSource("appointment", spec, collect)(AppointmentBox);
