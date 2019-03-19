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
import { formatDatabaseDate } from "./../../../lib/calendar-controller.js";
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import ColorPicker from "./ColorPicker";

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


const RightClickMenu = props => {
    return(
        <Menu id={props.id} style={{position: "absolute", zIndex: "4"}}>
           <Item onClick={() => {props.editTest(props.testId)}}>Edit</Item>
           <Separator />
           <Item disabled={!props.completed}>Schedule next</Item>
           <Separator />
           <Submenu label="Choose color">
             <ColorPicker testId={props.testId} />
           </Submenu>
           <Item>Remove color</Item>
        </Menu>
    );
}

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
                props.handleError(res, "Somebody is aready editing this test")
                //openAlert("Somebody is aready editing this test", "confirmationAlert", "Ok");
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
        if (res.success){
            if (res.response.insertId != undefined){
                openAlert(`A new test was automatically scheduled for the ${formatDatabaseDate(res.response.new_date)}`, "confirmationAlert", "Ok");
            }
        }else{
            this.props.handleError(res, "Somebody is aready editing this test")
        }
    });
  };

  render() {
    const {isDragging, connectDragSource} = this.props;
    const menuId = `${this.props.id}_${this.props.section}`; //MUST BE UNIQUE
    return connectDragSource(
      <div>
      <RightClickMenu id={menuId} testId={this.props.id} completed={this.props.type !== "no"} openColorPicker={this.props.openColorPicker} editTest={this.props.editTest}/>
      <MenuProvider id={menuId}>
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
              handleError={this.props.handleError}
          />

        </Container>
        </MenuProvider>

      </div>
    );
  }
}

export default DragSource("appointment", spec, collect)(AppointmentBox);
