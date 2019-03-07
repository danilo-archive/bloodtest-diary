import React from 'react'
import AppointmentBox from './AppointmentBox.js';

const styles = {
    display: 'inline-block',

}

export default class AppointmentBoxDragPreview extends React.Component{
    render(){
        return(
        <div style={styles}>
            <AppointmentBox 
                id = {this.props.item.test_id}
                type={this.props.item.completed_status}
                name={`${this.props.item.patient_name}`}
            />         
         </div>
      );
    }
}
