import React from 'react'
import AppointmentBox from './AppointmentBox.js';

const styles = {
    display: 'inline-block',
    transform: "rotate(3.5deg)",

}

export default class AppointmentBoxDragPreview extends React.Component{
    render(){
        return(
        <div style={styles}>
            <AppointmentBox
                id = {this.props.item.test_id}
                type={this.props.item.completed_status}
                name={`${this.props.item.patient_name}`}
                dueDate={this.props.item.dueDate}
                patient_colour={this.props.item.patient_colour}
                test_colour={this.props.item.test_colour}
            />
         </div>
      );
    }
}
