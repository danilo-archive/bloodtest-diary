import styled from "styled-components";
import Modal from "react-responsive-modal";

export default styled(Modal)`
  & > div {
    background: red;
    padding: 100px;
    border: solid 2px black;
  }
`;
