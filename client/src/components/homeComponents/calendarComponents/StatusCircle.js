import styled from "styled-components";

const combinations = {
  completed: "#5BC714",
  late: "#D10505",
  pending: "#FFD907",
  inReview: "#4286f4"
};

export default styled.div`
  min-height: 27px;
  min-width: 27px;
  margin-left: 7px;
  margin-right: 7px;
  background-color: transparent;
  border: solid 4px ${props => combinations[props.type]};
  border-radius: 50%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;


  &::after {
    content: '${props => props.type}';
    position: absolute;
    border-radius: 5px;
    font-size: 80%;
    padding-left: 50%;
    padding-right: 50%;
    bottom: 0%;
    transform: scale(0);
    transition: all ease-in 100ms;
    background-color: ${props => combinations[props.type]};
  }
  &:hover::after {
    transform: scale(1);
    bottom: 100%;
  }
`;
