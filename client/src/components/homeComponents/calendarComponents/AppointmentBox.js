import React from "react";
import styled from "styled-components";
import StatusCircle from "./StatusCircle";
import AppointmentInfo from "./AppointmentInfo";
import IconSet from "./IconSet";
import TimePill from "./TimePill";
import {getServerConnect} from "../../../serverConnection.js";
import {isPastDate} from "../../../lib/calendar-controller.js";
import { DragSource } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import {openAlert} from "../../Alert.js";

const serverConnect = getServerConnect();
const Container = styled.div`
  opacity: ${props => props.isDragging ? 0 : 1}
  display: block;
  position: relative;
  background-color: ${props => (props.tentative ? `#c1c1c1` : `white`)};

  margin-top: 3.5%;
  margin-bottom: 3.5%;

  padding-top: 5px;
  padding-bottom: 5px;

  height: 35px;
  width: auto;
  border: solid 1px rgb(100, 100, 100, 0);
  border-radius: 3px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  //box-shadow: 0 1px 1px rgba(0,0,0,0.16), 0 1px 1px rgba(0,0,0,0.16);


  z-index: 3;
  & .pill {
    opacity: 0;
    transition: opacity 150ms;
  }
  ${props =>
    props.tentative
      ? ``
      : `&:hover {
        border: solid 1px rgb(100, 100, 100, 0.4);
        font-weight: bold;
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


      .status {
        margin-left: 7px;
        margin-right: 7px;
      }
      .info {
        flex-grow: 1;
        flex-shrink: 1;
        overflow: scroll;
      }
      .iconsSet {
        margin-left: 7px;
        margin-right: 7px;
      }
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
      test_id: props.id,
      completed_status: props.type,
      patient_name: props.name,
      dueDate: props.dueDate
    };
  },
  endDrag(props, monitor, component){
    if (monitor.didDrop()){
      const newDate = monitor.getDropResult().newDate;
      if (newDate){
        serverConnect.changeTestDueDate(props.id, monitor.getDropResult().newDate, res => {
            if (!res.success){
                openAlert("Somebody is aready editing this test", "confirmationAlert", "Ok");
            }
        });
      }
    }
  },
  canDrag(props, monitor){
    return (props.section !== "overdue");
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

  componentDidMount(){
    const {connectDragPreview} = this.props;
    if (connectDragPreview){
      connectDragPreview(getEmptyImage(), {captureDraggingState: true});
    }
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
    this.serverConnect.changeTestStatus(this.props.id, status, res => {
        if (!res.success){
            openAlert("Somebody is aready editing this test", "confirmationAlert", "Ok");
        }
    });
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
