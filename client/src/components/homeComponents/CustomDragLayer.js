/**
 * This component represents a whole invisible layer on top of the whole app.
 * This allowes custom drag previews to be rendered on top of the app while components are being dragged.
 * @module CustomDragLayer
 * @author Jacopo Madaluni
 * @version 0.0.2
 */

import React from 'react'
import { DragLayer } from 'react-dnd'
import AppointmentBoxDragPreview from './calendarComponents/AppointmentBoxDragPreview';

// original 32
function snapToGrid(x, y) {
	const snappedX = Math.round(x / 2) * 2
	const snappedY = Math.round(y / 2) * 2
	return [snappedX, snappedY]
}

const layerStyles = {
	position: 'fixed',
	pointerEvents: 'none',
	zIndex: 100,
	left: 0,
    top: 0,
	width: '100%',
	height: '100%',
}

function getItemStyles(props){
    const {initialOffset, currentOffset} = props;
    if (!initialOffset || !currentOffset){
        return{
            display: "none"
        }
    }


    let {x, y} = currentOffset;
    if (props.snapToGrid){
        x -= initialOffset.x
        y -= initialOffset.y
        ;[x, y] = snapToGrid(x, y)
		x += initialOffset.x
		y += initialOffset.y
    }

    const transform = `translate(${x}px, ${y}px)`;
    return{
        transform,
        WebkitTransform: transform,
    }
}


class CustomDragLayer extends React.Component {
    render(){
        const {item, itemType, isDragging} = this.props;
        if (isDragging){
            return(
                <div style={layerStyles}>
                    <div style={getItemStyles(this.props)}>
                        <AppointmentBoxDragPreview item={item}/>
                    </div>
                </div>  
            );
        }else{
            return "";
        }
    }
}

export default DragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging:monitor.isDragging(),
}))(CustomDragLayer);