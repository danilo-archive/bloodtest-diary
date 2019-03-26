/**
 * This compoenent gets rendered when the AppointmentBox.js component gets dragged.
 * Renders a simplified rotated version of the appointment box
 * @module AppointmentBoxDragPreview
 * @author Jacopo Madaluni
 * @version 0.0.2
 */

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
                default_colour={this.props.item.default_colour}
                patient_colour={this.props.item.patient_colour}
                test_colour={this.props.item.test_colour}
            />
         </div>
      );
    }
}
