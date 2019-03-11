import React from "react";
import styled from 'styled-components'

import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

const CollapseButton = styled(Button)`
  margin-left: 10%;
`;

const CollapseContainer = styled.div`
  height: 40%;
`;

class AttributeCollapse extends React.Component {
    constructor(props) {
        super(props);

        this.checkboxContainer = this.props.title + "-checkboxContainer";
    }

    componentDidMount = () => {
        //this.createCheckBoxes();
    };

        createCheckBoxes() {
        const attributes = this.props.attributes;
        const title = this.props.title;
        if (typeof attributes !== 'undefined') {
            for (let i = 0; i < attributes.length; ++i) {
                let checkBoxId = title + "-" + attributes[i] + "-checkbox";
                this.addCheckBox(checkBoxId, attributes[i])
            }
        } else {
            console.log("You passed nothing")
        }
    }

    addCheckBox(checkBoxId, labelValue) {
        let input = document.createElement('input');
        input.id = checkBoxId;
        input.type = 'checkbox';

        let label = document.createElement('label');
        label.htmlFor = checkBoxId;
        label.innerText = labelValue;

        document.getElementById(this.checkboxContainer).appendChild(input);
        document.getElementById(this.checkboxContainer).appendChild(label);
    }


    render() {
        return (
            <>

            {/*<Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>*/}
            </>
        );
    }
}

export default AttributeCollapse;
