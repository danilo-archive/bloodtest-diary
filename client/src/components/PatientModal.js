import React from "react";
import Modal from "react-responsive-modal";
import "./PatientModal.css";
export default props => {
    return (
        <Modal
            classNames={{
                modal: "patient-modal"
            }}
            open={props.open}
            onClose={props.onClose}
            showCloseIcon={props.showCloseIcon}
            styles={props.style}
            center
        >
            {props.children}
        </Modal>
    );
};
