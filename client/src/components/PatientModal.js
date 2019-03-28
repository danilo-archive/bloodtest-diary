import React from "react";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import "../styles/PatientModal.css";

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
