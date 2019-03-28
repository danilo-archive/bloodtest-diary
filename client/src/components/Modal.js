import React from "react";
import Modal from "react-responsive-modal";
import "../styles/Modal.css";
export default props => {
  return (
    <Modal
      classNames={{
        modal: "modal"
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
